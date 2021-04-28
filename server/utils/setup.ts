import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

export const secretsKey = fs.readFileSync(
  path.join(__dirname, "../../key/jwtRS256.key"),
  { encoding: "utf-8" }
);

const paths = path.join(__dirname, "../../test.sqlite");
export const __process__ = process.env;
export const __dev__ = __process__.dev || false;
export const __test__ = __process__.test || false;
export const __prod__ = __process__.prod || false;
export const dbType = __dev__ ? (__test__ ? "sqlite" : "sqlite") : "mysql";
export const dbName = __dev__
  ? __test__
    ? paths
    : paths
  : __process__.db_name;
export const dbTime = __dev__
  ? __test__
    ? "datetime"
    : "datetime"
  : "timestamp";

const _ = fs.readFileSync(
  path.join(__dirname, "../__test__/assets/requirements.json"),
  { encoding: "utf-8" }
);
export const read = JSON.parse(_);

interface Write {
  token?: string;
  count?: string;
}

export const write = (args: Write) => {
  fs.writeFileSync(
    path.join(__dirname, "../__test__/assets/requirements.json"),
    JSON.stringify({
      count: args.count ? args.count : read["count"],
      token: args.token ? args.token : read["token"],
    })
  );
};

export const logger = (args: any) => {
  fs.writeFileSync(path.join(__dirname, "../../test.log"), args, { flag: "a" });
};

export const resetLogger = () => {
  const paths = path.join(__dirname, "../../test.log");
  exec(`rm ${paths}`);
};
