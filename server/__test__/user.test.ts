import faker from "faker";
import { UserEntity } from "../typeorm/entity/UserEntity";
import { calls } from "../utils-test/setup";
import { logger, read, write } from "../utils/setup";
import path from "path";

describe("User", () => {
  test("Create", async (done) => {
    const call = await calls();
    call
      .post("/api/v1/user/")
      .set("Content-Type", "application/json")
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: "Password",
        confirm_password: "Password",
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Accounts has been created" });
        return done();
      });
  });
  test("List", async (done) => {
    const call = await calls();
    call
      .get("/api/v1/user/")
      .set("Content-Type", "application/json")
      .expect(200)
      .then((res) => {
        write({ count: res.body.length, token: read["token"] });
        logger("- User List \n");
        logger(JSON.stringify(res.body.reverse().slice(0, 4)));
        logger("\n");
        expect(res.body).not.toEqual(null);
        expect(res.body).not.toEqual(undefined);
        return done();
      });
  });
  if (read["count"]) {
    test("Login", async (done) => {
      const user = await UserEntity.createQueryBuilder()
        .orderBy("createAt", "DESC")
        .getOne();
      const call = await calls();
      call
        .post("/api/v1/user/login/")
        .set("Content-Type", "application/json")
        .send({
          username: user.username,
          password: "Password",
        })
        .expect(200)
        .then((res) => {
          write({ token: res.body.token, count: read["count"] });
          logger("- User Login \n");
          logger(JSON.stringify(res.body));
          logger("\n");
          expect(res.body).not.toEqual(null);
          expect(res.body).not.toEqual(undefined);
          return done();
        });
    });
  } else {
    test.skip("Skip! user not have data", async (done) => {
      expect(2 + 2).toEqual(4);
      return done();
    });
  }

  if (read["token"]) {
    test("Detail", async (done) => {
      const user = await UserEntity.createQueryBuilder()
        .orderBy("createAt", "DESC")
        .getOne();
      const call = await calls();
      call
        .get(`/api/v1/user/${user.id}/`)
        .set("Authorization", `Bearer ${read["token"]}`)
        .set("Content-Type", "application/json")
        .expect(200)
        .then((res) => {
          logger("- User Detail \n");
          logger(JSON.stringify(res.body));
          logger("\n");
          expect(res.body).not.toEqual(null);
          expect(res.body).not.toEqual(undefined);
          return done();
        });
    });
    test("Update Accounts", async (done) => {
      const call = await calls();
      call
        .post("/api/v1/user/accounts/update/")
        .set("Authorization", `Bearer ${read["token"]}`)
        .set("Content-Type", "multipart/form-data")
        .field("first_name", faker.name.firstName())
        .field("last_name", faker.name.lastName())
        .field("country", faker.address.country())
        .field("province", faker.address.state())
        .field("city", faker.address.city())
        .field("address", faker.address.streetAddress())
        .attach(
          "avatar",
          path.join(
            __dirname,
            "./assets/artworks-oAc2nDPy6JgrX1vf-yw8xyg-t500x500.jpeg"
          )
        )
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            message: "Profile has been updated",
          });
          return done();
        });
    });
  } else {
    test("Skip! missing token", async (done) => {
      expect(2 + 2).toBe(4);
      return done();
    });
  }
});
