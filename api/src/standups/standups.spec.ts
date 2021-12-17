import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { getConnection, getRepository, Repository } from "typeorm";

import { AppModule } from "../app.module";
import { Standup } from "./entities/standup.entity";

describe("StandupController", () => {
  let app: INestApplication;
  let standupRepository: Repository<Standup>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    standupRepository = getRepository(Standup);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /standups", () => {
    it("returns an empty list when no standups are defined", () => {
      return request(app.getHttpServer())
        .get("/standups")
        .expect(200)
        .expect([]);
    });

    it("returns a standup list when previous standups exist", async () => {
      await standupRepository.save({
        name: "test-standup",
        channelId: "channel",
        questions: "questions",
        days: [],
      });

      return request(app.getHttpServer())
        .get("/standups")
        .expect(200)
        .expect([
          {
            channelId: "channel",
            name: "test-standup",
            questions: "questions",
            days: "monday",
          },
        ]);
    });
  });

  describe("GET /standups/:channelId", () => {
    it("returns a standup by channelId", async () => {
      await standupRepository.save({
        name: "unique-standup-by-channel",
        channelId: "channelId",
        questions: "questions",
        days: [],
      });

      return request(app.getHttpServer())
        .get("/standups/channelId")
        .expect(200)
        .expect({
          channelId: "channelId",
          name: "unique-standup-by-channel",
          questions: "questions",
          days: "monday",
        });
    });

    it("returns a 404 when no standup exists in the channel", () => {
      return request(app.getHttpServer())
        .get("/standups/does-not-exist")
        .expect(404)
        .expect({
          channelId: "channelId",
          name: "unique-standup-by-channel",
          questions: "questions",
          days: "monday",
        });
    });
  });

  describe("POST /standups", () => {
    it("creates new standup object", () => {
      return request(app.getHttpServer())
        .post("/standups")
        .set("Accept", "application/json")
        .send({
          name: "test-standup",
          channelId: "channel",
          questions: "questions",
          days: ["monday"],
        })
        .expect(201)
        .expect({
          name: "test-standup",
          channelId: "channel",
          questions: "questions",
          days: ["monday"],
        });
    });
  });

  describe("PATCH /standups", () => {
    it("updates a standup", async () => {
      await standupRepository.save({
        name: "unique-standup-by-channel",
        channelId: "channelId",
        questions: "questions",
        days: [],
      });

      return request(app.getHttpServer())
        .patch("/standups/channelId")
        .send({ name: "new-name" })
        .expect(200)
        .expect({ generatedMaps: [], raw: [], affected: 1 });
    });
  });

  describe("DELETE /standups", () => {
    it("deletes a standup", async () => {
      await standupRepository.save({
        name: "to-be-deleted",
        channelId: "channelId",
        questions: "questions",
        days: [],
      });

      return request(app.getHttpServer())
        .delete("/standups/channelId")
        .expect(200);
    });
  });
});
