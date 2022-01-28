import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection } from "typeorm";

import { AppModule } from "../app.module";

describe("StandupController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.get(Connection).close();
    await app.close();
  });

  describe("GET /channels", () => {
    it("returns all channels", () => {
      return request(app.getHttpServer())
        .get("/slack/channels")
        .expect(200)
        .expect([
          { name: "general", id: "C01LQPT2LMD" },
          { name: "software", id: "C01LQPW3VRV" },
          { name: "random", id: "C01M2ELANAH" },
        ]);
    });
  });
});
