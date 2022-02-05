import { INestApplication } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { Test, TestingModule } from "@nestjs/testing";
import { WebClient } from "@slack/web-api";
import { CronJob } from "cron";
import MockDate from "mockdate";
import * as request from "supertest";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import { BoltModule } from "src/core/modules/bolt.module";
import { SlackModule } from "src/slack/slack.module";
import { SlackService } from "src/slack/slack.service";
import { Day, DayOfWeek } from "src/standups/entities/day.entity";
import { Standup } from "src/standups/entities/standup.entity";
import { TimezoneOverride } from "src/standups/entities/tzoverride.entity";

import { AppModule } from "../app.module";
import {
  StandupNotification,
  UserStandupNotification,
} from "./entities/notification.entity";
import { NotificationsModule } from "./notifications.module";
import { NotificationsService } from "./notifications.service";

describe("NotificationsController", () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let userNotificationsRepository: Repository<UserStandupNotification>;
  let standupRepository: Repository<Standup>;
  let dayRepository: Repository<Day>;
  let standupNotificationsRepository: Repository<StandupNotification>;
  let tzOverrideRepository: Repository<TimezoneOverride>;
  let schedulerRegistry: SchedulerRegistry;
  let slackService: SlackService;

  let postMessage: jest.SpyInstance;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    standupRepository = getRepository(Standup);
    dayRepository = getRepository(Day);
    standupNotificationsRepository = getRepository(StandupNotification);
    userNotificationsRepository = getRepository(UserStandupNotification);
    tzOverrideRepository = getRepository(TimezoneOverride);

    schedulerRegistry = app.get<SchedulerRegistry>(SchedulerRegistry);

    slackService = moduleFixture.get<SlackService>(SlackService);
  });

  afterEach(() => {
    MockDate.reset();

    postMessage.mockReset();
  });

  beforeEach(async () => {
    await app.get(Connection).synchronize(true);

    postMessage = jest.spyOn(slackService, "postMessage");

    schedulerRegistry.getCronJobs().forEach((_, name) => {
      schedulerRegistry.deleteCronJob(name);
    });
  });

  // beforeEach(() => {
  //   jest.useFakeTimers();
  //   jest.setSystemTime(new Date("2022-02-05T09:00:00.000Z"));
  //   jest.advanceTimersByTime(1);
  // });

  const flushPromises = () => new Promise((res) => process.nextTick(res));

  // afterEach(() => {
  //   jest.useRealTimers();
  // });

  afterAll(async () => {
    await app.get(Connection).close();
    await app.close();
  });

  describe("on bootstrap", () => {
    // it("loads standup cronjobs from previously saved db", async () => {
    //   await standupRepository.save({
    //     name: "standup",
    //     startTime: "9:00",
    //     channelId: "channelId",
    //     questions: ["questions"],
    //     days: [],
    //   });
    //   await standupNotificationsRepository.save({
    //     interval: "* * * * *",
    //     channelId: "channelId",
    //   });
    //   const notificationsServiceInstance =
    //     moduleFixture.get(NotificationsService);
    //   notificationsServiceInstance.onApplicationBootstrap();
    //   return request(app.getHttpServer())
    //     .get("/notifications")
    //     .expect(200)
    //     .expect([{ name: "channelId", interval: "* * * * *" }]);
    // });
    // it("loads user cronjobs from previously saved db", async () => {
    //   await standupRepository.save({
    //     name: "standup",
    //     startTime: "9:00",
    //     channelId: "channelId",
    //     questions: ["questions"],
    //     days: [],
    //   });
    //   await userNotificationsRepository.save({
    //     interval: "* * * * *",
    //     channelId: "channelId",
    //     userId: "userId",
    //   });
    //   const notificationsServiceInstance =
    //     moduleFixture.get(NotificationsService);
    //   notificationsServiceInstance.onApplicationBootstrap();
    //   return request(app.getHttpServer())
    //     .get("/notifications")
    //     .expect(200)
    //     .expect([{ name: "channelId", interval: "* * * * *" }]);
    // });
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
    it("pings all users in the checkin for the standup with overrides", async () => {
      // set time to 3:00 PM GMT (which is a friday)
      MockDate.set("2022-02-04T15:00:00.000Z");

      jest
        .spyOn(slackService, "listUsers")
        .mockImplementation(() =>
          Promise.resolve([{ name: "name", id: "id", image: "image" }])
        );

      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [await dayRepository.save({ day: DayOfWeek.FRIDAY })],
        timezoneOverrides: [
          await tzOverrideRepository.save({
            userId: "userId",
            timezone: "EST",
          }),
        ],
      });

      await request(app.getHttpServer())
        .post("/notifications/standups/channel/checkins/trigger")
        .expect(201);

      expect(postMessage.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "id",
            "The *standup* is about to start.",
          ],
          Array [
            "id",
            "questions",
          ],
        ]
      `);
    });
  });

  describe("POST standups/:channelId/checkins/:userId/trigger", () => {
    it("pings specified user in the checkin for the standup with tz override", async () => {
      // set time to 3:00 PM GMT (which is a friday)
      MockDate.set("2022-02-04T15:00:00.000Z");

      jest
        .spyOn(slackService, "listUsers")
        .mockImplementation(() =>
          Promise.resolve([{ name: "name", id: "userId", image: "image" }])
        );

      const postMessage = jest.spyOn(slackService, "postMessage");

      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [await dayRepository.save({ day: DayOfWeek.FRIDAY })],
        timezoneOverrides: [
          await tzOverrideRepository.save({
            userId: "userId",
            timezone: "EST",
          }),
        ],
      });

      await request(app.getHttpServer())
        .post("/notifications/standups/channel/checkins/userId/trigger")
        .expect(201);

      expect(postMessage.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "userId",
            "The *standup* is about to start.",
          ],
          Array [
            "userId",
            "questions",
          ],
        ]
      `);
    });
    it("pings specified user in the checkin for the standup w/out tz override", async () => {
      // set time to 3:00 PM GMT (which is a friday)
      MockDate.set("2022-02-04T15:00:00.000Z");

      jest
        .spyOn(slackService, "listUsers")
        .mockImplementation(() =>
          Promise.resolve([{ name: "name", id: "userId", image: "image" }])
        );

      const postMessage = jest.spyOn(slackService, "postMessage");

      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [await dayRepository.save({ day: DayOfWeek.FRIDAY })],
        timezoneOverrides: [],
      });

      await request(app.getHttpServer())
        .post("/notifications/standups/channel/checkins/userId/trigger")
        .expect(201);

      expect(postMessage.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "userId",
            "The *standup* is about to start.",
          ],
          Array [
            "userId",
            "questions",
          ],
        ]
      `);
    });
    it("doesn't ping specified user when its not the right day/time", async () => {
      // set time to 3:00 PM GMT (which is a thursday)
      MockDate.set("2022-02-03T15:00:00.000Z");

      jest
        .spyOn(slackService, "listUsers")
        .mockImplementation(() =>
          Promise.resolve([{ name: "name", id: "userId", image: "image" }])
        );

      const postMessage = jest.spyOn(slackService, "postMessage");

      await standupRepository.save({
        name: "standup",
        startTime: "9:00",
        channelId: "channel",
        questions: ["questions"],
        days: [await dayRepository.save({ day: DayOfWeek.FRIDAY })],
        timezoneOverrides: [],
      });

      await request(app.getHttpServer())
        .post("/notifications/standups/channel/checkins/userId/trigger")
        .expect(201);

      expect(postMessage).not.toBeCalled();
    });
  });
});
