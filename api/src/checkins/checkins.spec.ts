import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { getConnection, getRepository, Repository } from "typeorm";

import { AppModule } from "../app.module";
import { Standup, Day } from "../standups/entities/standup.entity";
import { Checkin } from "./entities/checkin.entity";

describe("CheckinController", () => {
  let app: INestApplication;
  let standupRepository: Repository<Standup>;
  let checkinRepository: Repository<Checkin>;

  const createStandupWithCheckin = async (): Promise<[Checkin, Standup]> => {
    const standup = await standupRepository.save({
      name: "test-standup",
      channelId: "channelId",
      questions: "questions",
      days: [Day.MONDAY],
    });

    const checkin = await checkinRepository.save({
      answers: "answers",
      postMessageTs: "postMessageTs",
    });

    standup.checkins = [checkin];
    await standupRepository.save(standup);

    return [checkin, standup];
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    standupRepository = getRepository(Standup);
    checkinRepository = getRepository(Checkin);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /standups/:channelId/checkins", () => {
    it("returns empty list when no checkins defined for standup", async () => {
      await standupRepository.save({
        name: "test-standup",
        channelId: "channelId",
        questions: "questions",
        days: [Day.MONDAY],
      });

      return request(app.getHttpServer())
        .get("/standups/channelId/checkins")
        .expect(200)
        .expect([]);
    });
    it("returns checkin list when previous checkins exist for standup", async () => {
      await createStandupWithCheckin();

      return request(app.getHttpServer())
        .get("/standups/channelId/checkins")
        .expect(200)
        .expect((res) => {
          expect(res.body[0].answers).toBe("answers");
          expect(res.body[0].postMessageTs).toBe("postMessageTs");
        });
    });
    it("returns checkin by ID", async () => {
      const [checkin] = await createStandupWithCheckin();

      return request(app.getHttpServer())
        .get(`/standups/channelId/checkins/${checkin.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.answers).toBe("answers");
          expect(res.body.postMessageTs).toBe("postMessageTs");
        });
    });
  });

  describe("POST /standups/:channelId/checkins", () => {
    it("creates new checkin object", async () => {
      await createStandupWithCheckin();

      return request(app.getHttpServer())
        .post("/standups/channelId/checkins")
        .set("Accept", "application/json")
        .send({
          answers: "new-answers",
          postMessageTs: "post-message-ts",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.answers).toBe("new-answers");
          expect(res.body.postMessageTs).toBe("post-message-ts");
        });
    });
  });

  describe("PATCH /standups/:channelId/checkins/:checkinId", () => {
    it("updates a standup's checkin", async () => {
      const [checkin] = await createStandupWithCheckin();

      return request(app.getHttpServer())
        .patch(`/standups/channelId/checkins/${checkin.id}`)
        .send({ answers: "new-answers" })
        .expect(200)
        .expect({ generatedMaps: [], raw: [], affected: 1 });
    });
  });

  describe("DELETE /standups/:channelId/checkins/:checkinId", () => {
    it("deletes a standup's checkin", async () => {
      const [checkin] = await createStandupWithCheckin();

      return request(app.getHttpServer())
        .delete(`/standups/channelId/checkins/${checkin.id}`)
        .expect(200);
    });
  });
});
