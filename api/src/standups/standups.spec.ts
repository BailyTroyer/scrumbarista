import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection, getRepository, Repository } from "typeorm";

import { AppModule } from "../app.module";
import { Standup } from "./entities/standup.entity";
import { TimezoneOverride } from "./entities/tzoverride.entity";

describe("StandupController", () => {
  let app: INestApplication;
  let standupRepository: Repository<Standup>;
  let tzOverrideRepository: Repository<TimezoneOverride>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: "BOLT",
          useValue: {
            conversations: {
              members: jest.fn(),
              info: jest.fn(),
            },
            users: {
              info: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    standupRepository = getRepository(Standup);
    tzOverrideRepository = getRepository(TimezoneOverride);

    await app.get(Connection).synchronize(true);
  });

  beforeEach(async () => {
    await app.get(Connection).synchronize(true);
  });

  afterAll(async () => {
    await app.get(Connection).close();
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
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .get("/standups")
        .expect(200)
        .expect([
          {
            name: "test-standup",
            channelId: "channel",
            questions: ["questions"],
            days: [],
            timezoneOverrides: [],
            timezone: "CST",
            startTime: "09:00:00",
            users: [],
            active: true,
            introMessage: "",
            channelName: "",
          },
        ]);
    });
  });

  describe("GET /standups/:channelId", () => {
    it("returns a standup by channelId", async () => {
      await standupRepository.save({
        name: "unique-standup-by-channel",
        startTime: "9:00",
        channelId: "channelId",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .get("/standups/channelId")
        .expect(200)
        .expect({
          name: "unique-standup-by-channel",
          channelId: "channelId",
          questions: ["questions"],
          days: [],
          timezoneOverrides: [],
          timezone: "CST",
          startTime: "09:00:00",
          users: [],
          active: true,
          introMessage: "",
          channelName: "",
        });
    });

    it("returns a 404 when no standup exists in the channel", () => {
      return request(app.getHttpServer())
        .get("/standups/does-not-exist")
        .expect(404)
        .expect({
          message: {
            statusCode: 404,
            error: "Not Found",
            message:
              'Could not find any entity of type "Standup" matching: {\n' +
              '    "channelId": "does-not-exist"\n' +
              "}",
          },
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
          startTime: "9:00",
          questions: ["questions"],
          days: ["monday"],
        })
        .expect(201)
        .expect({
          name: "test-standup",
          channelId: "channel",
          questions: ["questions"],
          days: ["monday"],
          timezoneOverrides: [],
          timezone: "CST",
          startTime: "9:00",
          active: true,
          introMessage: "",
        });
    });
  });

  describe("PATCH /standups", () => {
    it("updates a standup", async () => {
      await standupRepository.save({
        name: "unique-standup-by-channel",
        startTime: "9:00",
        channelId: "channelId",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .patch("/standups/channelId")
        .send({ name: "new-name" })
        .expect(200)
        .expect({
          name: "new-name",
          channelId: "channelId",
          days: [],
          timezoneOverrides: [],
          startTime: "09:00:00",
          users: [],
          channelName: "",
        });
    });
  });

  describe("DELETE /standups", () => {
    it("deletes a standup", async () => {
      await standupRepository.save({
        name: "to-be-deleted",
        startTime: "9:00",
        channelId: "channelId",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .delete("/standups/channelId")
        .expect(200);
    });
  });

  describe("POST /standups/:channelId/timezone-overrides/:userId", () => {
    it("creates a new standup timezone override for a user", async () => {
      await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .post("/standups/channel/timezone-overrides/user")
        .set("Accept", "application/json")
        .send({
          timezone: "EST",
        })
        .expect(201);
    });
  });

  describe("PATCH /standups/:channelId/timezone-overrides/:userId", () => {
    it("updates a standup timezone override for a user", async () => {
      const standup = await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      await tzOverrideRepository.save({
        userId: "user",
        standup,
        timezone: "EST",
      });

      return request(app.getHttpServer())
        .patch("/standups/channel/timezone-overrides/user")
        .set("Accept", "application/json")
        .send({
          timezone: "GMT",
        })
        .expect(200)
        .expect({ userId: "user", timezone: "GMT" });
    });
  });

  describe("DELETE /standups/:channelId/timezone-overrides/:userId", () => {
    it("deletes a standup timezone override for a user", async () => {
      const standup = await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      await tzOverrideRepository.save({
        userId: "user",
        standup,
        timezone: "EST",
      });

      return request(app.getHttpServer())
        .delete("/standups/channel/timezone-overrides/user")
        .set("Accept", "application/json")
        .expect(200);
    });
  });
});
