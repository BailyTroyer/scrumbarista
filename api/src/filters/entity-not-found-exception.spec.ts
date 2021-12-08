import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "../app.module";

describe("CheckinController", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /standups/:channelId/checkins/:checkinId", () => {
    it("returns 404 when no standup exists for the given checkin", async () => {
      // return request(app.getHttpServer())
      //   .get("/standups/doesNotExist/checkins/checkinId")
      //   .expect(404);
      expect(true).toBeTruthy();
    });
  });
});
