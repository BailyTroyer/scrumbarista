import { App, ExpressReceiver } from "@slack/bolt";

import {
  checkinCommand,
  scrumbaristaCommand,
  standupCommand,
} from "./slack/commands";
import { dmMessage } from "./slack/messages";
import { checkinView } from "./slack/views";

declare let process: {
  env: {
    SLACK_BOT_TOKEN: string;
    SLACK_SIGNING_SECRET: string;
    PORT: number;
  };
};

const token = process.env.SLACK_BOT_TOKEN;
const port = process.env.PORT || 8080;

export const signingSecret = process.env.SLACK_SIGNING_SECRET;

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

receiver.app.get("/health", (_, res) => {
  res.send("healthy");
});

export const app = new App({ token, receiver });

app.command("/scrumbarista", scrumbaristaCommand);
app.command("/standup", standupCommand);
app.command("/checkin", checkinCommand);
app.view("checkin", checkinView);
app.message("hello", dmMessage);

(async () => {
  await app.start(port);
})();
