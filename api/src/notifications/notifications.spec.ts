import { INestApplication } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Test, TestingModule } from "@nestjs/testing";
import { CronJob } from "cron";
import * as request from "supertest";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import { CheckinsModule } from "src/checkins/checkins.module";
import { CheckinNotifierService } from "src/core/modules/checkin-notifier.module";
import { Standup } from "src/standups/entities/standup.entity";

import { AppModule } from "../app.module";
import {
  StandupNotification,
  UserStandupNotification,
} from "./entities/notification.entity";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

describe("NotificationsController", () => {
  let app: INestApplication;
  let userNotificationsRepository: Repository<UserStandupNotification>;
  let standupRepository: Repository<Standup>;
  let standupNotificationsRepository: Repository<StandupNotification>;
  let schedulerRegistry: SchedulerRegistry;

  let postMessage: jest.Mock;

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

    postMessage = jest.fn();

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

  describe("POST standups/:channelId/checkins/trigger", () => {
    it("pings all users in the checkin for the standup", async () => {
      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      await request(app.getHttpServer())
        .post("/notifications/standups/channel/checkins/trigger")
        .expect(201);

      // @todo validate postMessage was called on trigger
      // expect(postMessage).toHaveBeenCalledWith();
    });
  });

  describe("POST standups/:channelId/checkins/:userId/trigger", () => {
    it("pings all users in the checkin for the standup", async () => {
      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [],
      });

      return request(app.getHttpServer())
        .post("/notifications/standups/channel/checkins/user/trigger")
        .expect(201);
    });
  });
});
