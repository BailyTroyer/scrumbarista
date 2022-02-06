import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

const date =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe("HealthController", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: "BOLT",
          useValue: {
            auth: {
              test: jest.fn().mockReturnValue({ ok: true }),
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /health", () => {
    it("returns health with time", () => {
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

  describe("GET /health/authenticated", () => {
    it("returns healthy when authenticated", () => {
      return request(app.getHttpServer())
        .get("/health/authenticated")
        .set("authorization", "bearer SOME_AUTH_TOKEN")
        .expect(200)
        .expect(({ body }) =>
          expect(body).toEqual({
            status: "healthy",
            time: expect.stringMatching(date),
          })
        );
    });
    it("returns unauthenticated when missing token header", () => {
      return request(app.getHttpServer())
        .get("/health/authenticated")
        .expect(403)
        .expect({
          statusCode: 403,
          message: "Forbidden resource",
          error: "Forbidden",
        });
    });
  });
});
