import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection } from "typeorm";

import { AppModule } from "../app.module";

describe("HealthController", () => {
  let app: INestApplication;

  beforeAll(async () => {
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

  describe("/health", () => {
    it("(GET) returns 200 OK", () => {
      return request(app.getHttpServer())
        .get("/health")
        .expect(200)
        .expect("healthy");
    });
  });
});
