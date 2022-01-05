import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import { AppModule } from "../app.module";
import { Standup } from "../standups/entities/standup.entity";
import { Checkin } from "./entities/checkin.entity";

const uuid =
  /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

const date =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe("CheckinController", () => {
  let app: INestApplication;
  let standupRepository: Repository<Standup>;
  let checkinRepository: Repository<Checkin>;

  const createStandupWithCheckin = async (): Promise<[Checkin, Standup]> => {
    const standup = await standupRepository.save({
      name: "test-standup",
      channelId: "channelId",
      questions: ["questions"],
      days: [],
    });

    const checkin = await checkinRepository.save({
      answers: ["answers"],
      postMessageTs: "postMessageTs",
      userId: "user",
    });

    standup.checkins = [checkin];
    await standupRepository.save(standup);

    return [checkin, standup];
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    standupRepository = getRepository(Standup);
    checkinRepository = getRepository(Checkin);
  });

  beforeEach(async () => {
    await app.get(Connection).synchronize(true);
  });

  afterAll(async () => {
    await app.get(Connection).close();
    await app.close();
  });

  describe("GET /standups/:channelId/checkins", () => {
    it("returns empty list when no checkins defined for standup", async () => {
      await standupRepository.save({
        name: "test-standup",
        channelId: "channelId",
        questions: ["questions"],
        days: [],
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
          answers: ["new-answers"],
          postMessageTs: "post-message-ts",
          userId: "user",
        })
        .expect(201)
        .expect(({ body }) =>
          expect(body).toEqual({
            id: expect.stringMatching(uuid),
            createdDate: expect.stringMatching(date),
            answers: ["new-answers"],
            postMessageTs: "post-message-ts",
            userId: "user",
            channelId: "channelId",
          })
        );
    });
  });

  describe("PATCH /standups/:channelId/checkins/:checkinId", () => {
    it("updates a standup's checkin", async () => {
      const [checkin] = await createStandupWithCheckin();

      return request(app.getHttpServer())
        .patch(`/standups/channelId/checkins/${checkin.id}`)
        .send({ answers: ["new-answers"] })
        .expect(200);
    });
  });

  describe("DELETE /standups/:channelId/checkins/:checkinId", () => {
    it("deletes a standup's checkin", async () => {
      const [checkin] = await createStandupWithCheckin();

      return request(app.getHttpServer())
        .delete(`/standups/checkins/${checkin.id}`)
        .expect(200);
    });
  });
});
