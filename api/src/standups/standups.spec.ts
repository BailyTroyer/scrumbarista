import { INestApplication } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Test, TestingModule } from "@nestjs/testing";
import { CronJob } from "cron";
import * as request from "supertest";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import {
  StandupNotification,
  UserStandupNotification,
} from "src/notifications/entities/notification.entity";

import { AppModule } from "../app.module";
import { Day, DayOfWeek } from "./entities/day.entity";
import { Standup } from "./entities/standup.entity";
import { TimezoneOverride } from "./entities/tzoverride.entity";

describe("StandupController", () => {
  let app: INestApplication;
  let standupRepository: Repository<Standup>;
  let dayRepository: Repository<Day>;
  let tzOverrideRepository: Repository<TimezoneOverride>;
  let schedulerRegistry: SchedulerRegistry;
  let standupNotificationsRepository: Repository<StandupNotification>;
  let userNotificationsRepository: Repository<UserStandupNotification>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    standupRepository = getRepository(Standup);
    tzOverrideRepository = getRepository(TimezoneOverride);
    dayRepository = getRepository(Day);
    standupNotificationsRepository = getRepository(StandupNotification);
    userNotificationsRepository = getRepository(UserStandupNotification);

    schedulerRegistry = app.get<SchedulerRegistry>(SchedulerRegistry);
  });

  beforeEach(async () => {
    await app.get(Connection).synchronize(true);

    schedulerRegistry.getCronJobs().forEach((_, name) => {
      schedulerRegistry.deleteCronJob(name);
    });
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

    it("returns a standup list when previous standups exist with tz override", async () => {
      await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
        timezoneOverrides: [
          await tzOverrideRepository.save({
            userId: "user",
            timezone: "EST",
          }),
        ],
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
            timezoneOverrides: [{ timezone: "EST", userId: "user" }],
            timezone: "CST",
            startTime: "09:00:00",
            users: [],
            active: true,
            introMessage: "",
            channelName: "",
          },
        ]);
    });

    it("returns all standups on the same day", async () => {
      await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [await dayRepository.save({ day: DayOfWeek.MONDAY })],
      });

      return request(app.getHttpServer())
        .get("/standups?day=monday")
        .expect(200)
        .expect([
          {
            name: "test-standup",
            channelId: "channel",
            questions: ["questions"],
            days: ["monday"],
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
    it("updates a standup timezone and days", async () => {
      await standupRepository.save({
        name: "unique-standup-by-channel",
        startTime: "9:00",
        channelId: "channelId",
        questions: ["questions"],
        days: [],
      });

      schedulerRegistry.addCronJob(
        "channelId",
        new CronJob("* * * * *", () => {
          return;
        })
      );

      await standupNotificationsRepository.save({
        interval: "* * * * *",
        channelId: "channelId",
      });

      return request(app.getHttpServer())
        .patch("/standups/channelId")
        .send({ name: "new-name", days: ["monday", "tuesday"] })
        .expect(200)
        .expect({
          name: "new-name",
          channelId: "channelId",
          questions: ["questions"],
          days: ["monday", "tuesday"],
          timezoneOverrides: [],
          timezone: "CST",
          startTime: "09:00:00",
          users: [],
          active: true,
          introMessage: "",
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
      await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
        timezoneOverrides: [
          await tzOverrideRepository.save({
            userId: "user",
            timezone: "EST",
          }),
        ],
      });

      return request(app.getHttpServer())
        .patch("/standups/channel/timezone-overrides/user")
        .set("Accept", "application/json")
        .send({
          timezone: "GMT",
        })
        .expect(200)
        .expect({ userId: "user", channelId: "channel", timezone: "GMT" });
    });
    it("updates a timezone override for a given user", async () => {
      await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [await dayRepository.save({ day: DayOfWeek.MONDAY })],
        timezoneOverrides: [
          await tzOverrideRepository.save({
            userId: "user",
            timezone: "EST",
          }),
        ],
      });

      schedulerRegistry.addCronJob(
        "channel-user",
        new CronJob("* * * * *", () => {
          return;
        })
      );

      await userNotificationsRepository.save({
        interval: "* * * * *",
        channelId: "channel",
        userId: "user",
      });

      return request(app.getHttpServer())
        .patch("/standups/channel/timezone-overrides/user")
        .set("Accept", "application/json")
        .send({
          timezone: "EST",
        })
        .expect(200)
        .expect({ userId: "user", channelId: "channel", timezone: "EST" });
    });
  });

  describe("DELETE /standups/:channelId/timezone-overrides/:userId", () => {
    it("deletes a standup timezone override for a user", async () => {
      await standupRepository.save({
        name: "test-standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
        timezoneOverrides: [
          await tzOverrideRepository.save({
            userId: "user",
            timezone: "EST",
          }),
        ],
      });

      return request(app.getHttpServer())
        .delete("/standups/channel/timezone-overrides/user")
        .set("Accept", "application/json")
        .expect(200);
    });
  });
});
