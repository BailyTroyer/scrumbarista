import { INestApplication } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Test, TestingModule } from "@nestjs/testing";
import { CronJob } from "cron";
import * as request from "supertest";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import { Standup } from "src/standups/entities/standup.entity";

import { AppModule } from "../app.module";
import {
  StandupNotification,
  UserStandupNotification,
} from "./entities/notification.entity";

describe("StandupController", () => {
  let app: INestApplication;
  let userNotificationsRepository: Repository<UserStandupNotification>;
  let standupRepository: Repository<Standup>;
  let standupNotificationsRepository: Repository<StandupNotification>;
  let schedulerRegistry: SchedulerRegistry;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    userNotificationsRepository = getRepository(UserStandupNotification);
    standupRepository = getRepository(Standup);
    standupNotificationsRepository = getRepository(StandupNotification);

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

  describe("GET /notifications", () => {
    it("returns an empty list when no notifications are saved", () => {
      return request(app.getHttpServer())
        .get("/notifications")
        .expect(200)
        .expect([]);
    });

    it("returns a standup list when previous notifications exist", async () => {
      await standupNotificationsRepository.save({
        interval: "* * * * *",
        channelId: "channel",
      });
      schedulerRegistry.addCronJob(
        "channel",
        new CronJob("* * * * *", () => {
          return;
        })
      );

      return request(app.getHttpServer())
        .get("/notifications")
        .expect(200)
        .expect([{ name: "channel", interval: "* * * * *" }]);
    });
  });

  describe("POST /notifications/:channelId", () => {
    it("creates new standup notification", async () => {
      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .post("/notifications/channel")
        .set("Accept", "application/json")
        .send({ interval: "* * * * *" })
        .expect(201)
        .expect({ interval: "* * * * *", channelId: "channel" });
    });
  });

  describe("DELETE /notifications/crons/:channelId", () => {
    it("deletes a standup notification", async () => {
      await standupNotificationsRepository.save({
        interval: "* * * * *",
        channelId: "channel",
      });
      schedulerRegistry.addCronJob(
        "channel",
        new CronJob("* * * * *", () => {
          return;
        })
      );

      return request(app.getHttpServer())
        .delete("/notifications/crons/channel")
        .expect(200);
    });
  });

  describe("POST /notifications/:channelId/:userId", () => {
    it("creates new standup notification for a given user", async () => {
      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .post("/notifications/channel/user")
        .set("Accept", "application/json")
        .send({ interval: "* * * * *" })
        .expect(201)
        .expect({
          interval: "* * * * *",
          channelId: "channel",
          userId: "user",
        });
    });
  });

  describe("DELETE /notifications/crons/:channelId/:userId", () => {
    it("deletes a standup notification for a given user", async () => {
      await userNotificationsRepository.save({
        interval: "* * * * *",
        channelId: "channel",
        userId: "user",
      });
      schedulerRegistry.addCronJob(
        "channel-user",
        new CronJob("* * * * *", () => {
          return;
        })
      );

      return request(app.getHttpServer())
        .delete("/notifications/crons/channel/user")
        .expect(200);
    });
  });
});
