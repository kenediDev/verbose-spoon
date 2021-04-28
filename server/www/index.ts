import express from "express";
import { __process__, __test__ } from "../utils/setup";
import endpoints from "express-list-endpoints";
import { Connection, createConnection } from "typeorm";
import Con from "../config/typeorm";
import { useContainer, useExpressServer } from "routing-controllers";
import { Container } from "typeorm-typedi-extensions";
import { UserControllers } from "../controllers/user.controllers";
import jwt from "jsonwebtoken";

class App {
  public app: express.Express = express();
  private port: number = parseInt(__process__.port) || 8000;
  private logger = (args: any) => {
    if (!__test__) {
      console.log(args);
    }
  };
  constructor() {
    this.connection();
    this.extensions();
    if (!__test__) {
      this.logger(endpoints(this.app));
      this.listen();
    }
  }
  private extensions() {
    useContainer(Container);
    useExpressServer(this.app, {
      routePrefix: "/api/v1/",
      controllers: [UserControllers],
      currentUserChecker: function (req) {
        const token = req.request.headers.authorization.split(" ")[1];
        return jwt.decode(token);
      },
    });
  }

  public async connection(): Promise<Connection> {
    return createConnection(Con)
      .then(async (con) => {
        this.logger("DB Connection");
        return con;
      })
      .catch((err) => {
        this.logger(err);
        return err;
      });
  }
  private listen() {
    this.app.listen(this.port, () => {
      console.log("running application " + this.port);
    });
  }
}

export const app = new App();
