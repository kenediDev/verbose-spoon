import Joi from "joi";
import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { AccountsEntity } from "../typeorm/entity/AccountsEntity";
import { UserEntity } from "../typeorm/entity/UserEntity";
import { Upload } from "../types/interface";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { CountryEntity } from "../typeorm/entity/CountryEntity";

@Service()
@EntityRepository(UserEntity)
export class UserService extends Repository<UserEntity> {
  async creates(options: any) {
    const schema = Joi.object().keys({
      username: Joi.string().min(3).max(22).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      confirm_password: Joi.ref("password"),
    });
    const { value, error } = schema.validate(options);
    if (error) {
      return error.message;
    }
    if (await UserEntity.filter(value)) {
      return "Username or email already exists, please choose another one";
    }
    const create = new UserEntity();
    create.username = value.username;
    create.email = value.email;
    create.password = value.password;
    create.accounts = await create.insertAccounts();
    await UserEntity.save(create);
    return false;
  }
  async login(options: any) {
    const schema = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    const { value, error } = schema.validate(options);
    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
    const user = await UserEntity.findOne({
      where: { username: value.username },
    });
    if (!user) {
      return {
        error: true,
        message: "Wrong username or password, please check again",
      };
    }
    if (!UserEntity.verify(options, user)) {
      return {
        error: true,
        message: "Wrong username or password, please check again",
      };
    }

    return {
      user: user,
    };
  }
  async list() {
    return UserEntity.createQueryBuilder("user")
      .leftJoinAndSelect("user.accounts", "accounts")
      .leftJoinAndSelect("accounts.location", "country")
      .where("accounts.first_name is not null")
      .andWhere("country.country is not null")
      .getMany();
  }

  async detail(args: string) {
    return UserEntity.createQueryBuilder("user")
      .leftJoinAndSelect("user.accounts", "accounts")
      .where("user.id=:id", { id: args })
      .getOne();
  }

  async updates(options: any, file: Upload, args: string) {
    const schema = Joi.object().keys({
      first_name: Joi.string().min(3).required(),
      last_name: Joi.string().required(),
      country: Joi.string().required(),
      province: Joi.string().required(),
      city: Joi.string().required(),
      address: Joi.string().required(),
    });
    const { value, error } = schema.validate(options);
    if (error) {
      return error.message;
    }
    const retrieve = await UserEntity.createQueryBuilder("user")
      .leftJoinAndSelect("user.accounts", "accounts")
      .leftJoinAndSelect("accounts.location", "country")
      .where("user.id=:id", { id: args })
      .getOne();
    retrieve.accounts.first_name = value.first_name;
    retrieve.accounts.last_name = value.last_name;
    retrieve.accounts.location.country = value.country;
    retrieve.accounts.location.province = value.province;
    retrieve.accounts.location.city = value.city;
    retrieve.accounts.location.address = value.address;
    if (file) {
      const filename = `${crypto.randomBytes(20).toString("hex")}.${
        file.mimetype.split("/")[1]
      }`;
      fs.writeFile(
        path.join(__dirname, `../controllers/media/${filename}`),
        file.buffer,
        () => {}
      );
      retrieve.accounts.avatar = `/static/${filename}`;
    }

    await AccountsEntity.update(retrieve.accounts.id, retrieve.accounts);
    await CountryEntity.update(
      retrieve.accounts.location.id,
      retrieve.accounts.location
    );
    return false;
  }
}
