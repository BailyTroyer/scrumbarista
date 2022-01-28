import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection } from "typeorm";

import { AppModule } from "../app.module";

const date =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

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
        .expect(({ body }) =>
          expect(body).toEqual({
            status: "healthy",
            time: expect.stringMatching(date),
          })
        );
    });
  });
});
