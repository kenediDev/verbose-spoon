import { Connection } from "typeorm";
import supertest, { SuperTest, Test } from "supertest";
import { app } from "../www";
import { resetLogger } from "../utils/setup";

let con: Connection;

beforeAll(async () => {
  resetLogger();
  con = await app.connection();
});

afterAll(async () => {
  if (con) {
    con.close();
  }
});

export const calls = async (): Promise<SuperTest<Test>> => {
  return supertest(app.app);
};
