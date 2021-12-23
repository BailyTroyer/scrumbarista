import { App, ExpressReceiver } from "@slack/bolt";
import * as bodyParser from "body-parser";
import cors from "cors";
import { Request } from "express";
import _ from "lodash";

import {
  checkinCommand,
  itotwCommand,
  randomOrderCommand,
  randomPersonCommand,
  saveItotwCommand,
  scrumbaristaCommand,
  standupCommand,
} from "./slack/commands";
import { dmMessage } from "./slack/messages";
import { checkinView, standupView } from "./slack/views";

declare let process: {
  env: {
    SLACK_BOT_TOKEN: string;
    SLACK_SIGNING_SECRET: string;
    SLACK_CLIENT_ID: string;
    SLACK_CLIENT_SECRET: string;
    PORT: number;
  };
};

const token = process.env.SLACK_BOT_TOKEN;
const port = process.env.PORT || 8080;

const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;

export const signingSecret = process.env.SLACK_SIGNING_SECRET;

/**
 * Recursively replace object keys from snake_case to camelCase.
 * @also @see https://stackoverflow.com/a/46598122/9493938
 */
const camelCaseKeys = (obj) => {
  if (!_.isObject(obj)) {
    return obj;
  } else if (_.isArray(obj)) {
    return obj.map((v) => camelCaseKeys(v));
  }
  return _.reduce(
    obj,
    (r, v, k) => {
      return {
        ...r,
        [_.camelCase(k)]: camelCaseKeys(v),
      };
    },
    {}
  );
};

/**
 * Create an express middle-tier receiver for handling generic
 * HTTP requests (such as /health) for additional functionalities.
 * @see also https://github.com/slackapi/bolt-js/issues/212
 */
export const receiver = new ExpressReceiver({
  signingSecret,
  endpoints: "/slack/events",
  signatureVerification: false,
});

receiver.app.use(bodyParser.urlencoded({ extended: true }));
receiver.app.use(bodyParser.json());
receiver.app.use(bodyParser.raw());
receiver.app.use(
  cors({
    origin: "*",
  })
);

receiver.app.get("/health", (_, res) => {
  res.send("healthy");
});

interface SlackAuthRequest extends Request {
  query: {
    code: string;
  };
}

receiver.app.get("/auth", async (request: SlackAuthRequest, res) => {
  const { code } = request.query;
  try {
    const token = await app.client.openid.connect.token({
      code,
      client_id: clientId,
      client_secret: clientSecret,
    });
    const user = await app.client.openid.connect.userInfo({
      token: token.access_token,
    });
    res.json(camelCaseKeys({ token, user }));
  } catch (error) {
    res.json(camelCaseKeys({ error }));
  }
});

export const app = new App({ token, receiver });

// Core SCRUM
app.command("/scrumbarista", scrumbaristaCommand);
app.command("/standup", standupCommand);
app.command("/checkin", checkinCommand);
app.view("checkin", checkinView);
app.view("standup", standupView);
app.message(/^.*/, dmMessage);

// easter-eggs
app.command("/random-order", randomOrderCommand);
app.command("/random-person", randomPersonCommand);
app.command("/itotw", itotwCommand);
app.command("/save-itotw", saveItotwCommand);

(async () => {
  await app.start(port);
})();
