import { Response } from "express";
import {
  Body,
  Controller,
  CurrentUser,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFile,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../service/user.service";
import jwt from "jsonwebtoken";
import { secretsKey } from "../utils/setup";
import { UserDecode } from "../types/interface";
import { Multer_ } from "./utils/multers";

var bodyParser = require("body-parser");

@Service()
@Controller("user/")
@UseBefore(bodyParser.json())
@UseBefore(bodyParser.urlencoded({ extended: false }))
export class UserControllers {
  constructor(private service: UserService) {}

  @HttpCode(201)
  @Post()
  async create(@Body() body: any, @Res() res: Response) {
    const instance = await this.service.creates(body);
    if (instance) {
      return res.status(400).json({ message: instance });
    }
    return res.status(201).json({ message: "Accounts has been created" });
  }

  @HttpCode(200)
  @Get()
  async list(@Res() res: Response) {
    return res.status(200).json(await this.service.list());
  }

  @HttpCode(200)
  @Post("login/")
  async login(@Body() body: any, @Res() res: Response) {
    const instance = await this.service.login(body);
    if (instance.error) {
      return res.status(400).json({ message: instance.message });
    }
    return res.status(200).json({
      token: jwt.sign({ user: instance.user }, secretsKey, {
        algorithm: "RS256",
      }),
    });
  }

  @HttpCode(200)
  @Get(":id/")
  async detail(
    @Param("id") id: string,
    @Res() res: Response,
    @CurrentUser() user: UserDecode
  ) {
    if (!user) {
      return res.status(400).json(false);
    }
    const instance = await this.service.detail(id);
    if (!instance) {
      return res.status(400).json({
        message: "Accounts not found",
      });
    }
    return res.status(200).json(instance);
  }

  @HttpCode(200)
  @Post("accounts/update/")
  async accounts(
    @UploadedFile("avatar", {
      options: new Multer_().upload(),
    })
    avatar: any,
    @Body() body: any,
    @Res() res: Response,
    @CurrentUser() user: UserDecode
  ) {
    if (!user) {
      return res.status(400).json(false);
    }
    const instance = await this.service.updates(body, avatar, user.user.id);
    if (instance) {
      return res.status(400).json({ message: instance });
    }
    return res.status(200).json({ message: "Profile has been updated" });
  }
}
