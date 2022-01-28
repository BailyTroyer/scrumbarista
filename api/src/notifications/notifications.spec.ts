import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Connection, getConnection, getRepository, Repository } from "typeorm";

import { AppModule } from "../app.module";
import {
  StandupNotification,
  UserStandupNotification,
} from "./entities/notification.entity";

describe("StandupController", () => {
  let app: INestApplication;
  let userStandupRepository: Repository<UserStandupNotification>;
  let standupRepository: Repository<StandupNotification>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await getConnection().synchronize(true);

    userStandupRepository = getRepository(UserStandupNotification);
    standupRepository = getRepository(StandupNotification);
  });

  beforeEach(async () => {
    await app.get(Connection).synchronize(true);
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
      expect(true).toBeTruthy();
    });
  });

  // describe("POST /notifications/:channelId", () => {
  //   it("creates new standup object", () => {
  //     return request(app.getHttpServer())
  //       .post("/standups")
  //       .set("Accept", "application/json")
  //       .send({
  //         name: "test-standup",
  //         channelId: "channel",
  //         questions: ["questions"],
  //         days: ["monday"],
  //       })
  //       .expect(201)
  //       .expect({
  //         name: "test-standup",
  //         channelId: "channel",
  //         questions: ["questions"],
  //         days: ["monday"],
  //       });
  //   });
  // });

  // describe("POST /notifications/:channelId/:userId", () => {
  //   it("updates a standup", async () => {
  //     await standupRepository.save({
  //       name: "unique-standup-by-channel",
  //       channelId: "channelId",
  //       questions: ["questions"],
  //       days: [],
  //     });

  //     return request(app.getHttpServer())
  //       .patch("/standups/channelId")
  //       .send({ name: "new-name" })
  //       .expect(200)
  //       .expect({ name: "new-name", channelId: "channelId", days: [] });
  //   });
  // });

  // describe("DELETE /crons/:channelId", () => {
  //   it("deletes a standup", async () => {
  //     await standupRepository.save({
  //       name: "to-be-deleted",
  //       channelId: "channelId",
  //       questions: ["questions"],
  //       days: [],
  //     });

  //     return request(app.getHttpServer())
  //       .delete("/standups/channelId")
  //       .expect(200);
  //   });
  // });

  // describe("DELETE /crons/:channelId/:userId", () => {});

  // describe("POST /standups/:channelId/checkins/trigger", () => {});
  // describe("POST /standups/:channelId/checkins/:userId/trigger", () => {});
});
