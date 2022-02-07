import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { WebClient } from "@slack/web-api";
import * as request from "supertest";
import { Connection } from "typeorm";

import { AppModule } from "../app.module";

describe("SlackController", () => {
  let app: INestApplication;
  let bolt: WebClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    bolt = moduleFixture.get<WebClient>("BOLT");
  });

  afterAll(async () => {
    await app.get(Connection).close();
    await app.close();
  });

  describe("GET /channels", () => {
    it("returns all channels", () => {
      jest.spyOn(bolt.conversations, "list").mockReturnValue(
        Promise.resolve({
          ok: true,
          channels: [{ name: "name", id: "id", is_channel: true }],
        })
      );

      return request(app.getHttpServer())
        .get("/slack/channels")
        .expect(200)
        .expect([{ name: "name", id: "id" }])
        .catch((err) => {
          console.log("ERR: ", err);
        });
    });
  });
});
