import { App } from "@slack/bolt";

import { Standup } from "./models";
import { addCheckin, getCheckins, listStandups } from "./services/api";

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const app = new App({ token, signingSecret });

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const date = new Date();
const localDateString = date.toLocaleDateString();
const dayName = days[date.getDay()];

const checkAndPingUsers = async () => {
  const standups = await listStandups(dayName);

  standups?.forEach(
    async ({ channelId: channel, name, ...standup }: Standup) => {
      const questions = standup.questions.filter((q) => q !== "");

      // fetch all users in channel
      const users = await app.client.conversations.members({
        token,
        channel,
      });

      users.members.forEach(async (user: string) => {
        const checkins = await getCheckins(channel, user, localDateString);

        // if user already completed/started checkin
        if (checkins.length === 0) {
          // send reminder message & create empty checkin for later completion
          const checkin = { answers: [], postMessageTs: "", userId: user };
          await addCheckin(channel, checkin);

          await app.client.chat.postMessage({
            token,
            channel: user,
            text: `The *${name}* is about to start.`,
          });
          await app.client.chat.postMessage({
            token,
            channel: user,
            text: questions[0],
          });
        }
      });
    }
  );
};

(async () => {
  await checkAndPingUsers();
})();
