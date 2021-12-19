import crypto from "crypto";

import request from "supertest";

import { receiver, app, signingSecret } from "../app";

/**
 * Generate a valid signature for authenticating a
 * given userwith the slack API within Bolt.
 *
 * @see also https://api.slack.com/authentication/verifying-requests-from-slack
 */
const generateSignature = (
  body: any,
  timestamp: number,
  signingSecret: string
): string => {
  const bodyString = JSON.stringify(body);
  const signatureString = `v0:${timestamp}:${bodyString}`;
  const hash = crypto
    .createHmac("sha256", signingSecret)
    .update(signatureString, "utf8")
    .digest("hex");
  return `v0=${hash}`;
};

describe("The Scrumbarista BoltJS App", () => {
  afterAll(async () => {
    await app.stop();
  });

  describe("express reciever", () => {
    it("returns a 200 on /healthcheck", async () => {
      return request(receiver.app).get("/health").expect(200).expect("healthy");
    });
  });

  // describe("/scrumbarista slash command", () => {
  //   it("properly routes to the scrumbarista command helper", async () => {
  //     const mockShortcutPayload = {
  //       command: "/scrumbarista",
  //       channel: "channel",
  //     };

  //     const timestamp = new Date().valueOf();
  //     const signature = generateSignature(
  //       JSON.stringify(mockShortcutPayload),
  //       timestamp,
  //       signingSecret
  //     );

  //     await request(receiver.app)
  //       .post("/slack/events")
  //       .send(mockShortcutPayload)
  //       .set({
  //         "x-slack-signature": signature,
  //         "x-slack-request-timestamp": timestamp,
  //       })
  //       .expect(200);
  //   });
  // });
});
