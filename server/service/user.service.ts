import Joi from "joi";
import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../typeorm/entity/UserEntity";

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
    await create.save();
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
      .getMany();
  }

  async detail(args: string) {
    return UserEntity.createQueryBuilder("user")
      .leftJoinAndSelect("user.accounts", "accounts")
      .where("user.id=:id", { id: args })
      .getOne();
  }
}
