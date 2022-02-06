import request from "supertest";

import { receiver, app } from "../app";

describe("The Scrumbarista BoltJS App", () => {
  afterAll(async () => {
    await app.stop();
  });

  describe("express reciever", () => {
    it("returns a 200 on /healthcheck", async () => {
      return request(receiver.app).get("/health").expect(200).expect("healthy");
    });
  });
});
