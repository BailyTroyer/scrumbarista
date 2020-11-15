import { App } from "@slack/bolt";
import MongooseHandler from "./services/mongoose";
const mongooseHandler = new MongooseHandler(
  `mongodb://username:password@localhost:27017/scrumbarista?authSource=admin`
);

const signingSecret = "26033c893517faca679b57cea9d6e1f2";
const token = "xoxb-3389729784-1448821915409-BvtOrRHPbTYfM1DHccDgWDAj";
const app = new App({ token, signingSecret });

const checkAndPingUsers = async () => {
  // get current day
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var d = new Date();
  var dayName = days[d.getDay()];

  const standups = await mongooseHandler.listStandups(dayName);

  standups.forEach(async (s: any) => {
    // get users in channel
    const channel = s.channelID;
    const name = s.name;
    const questions = s.questions.split("\n");

    const date = new Date().toLocaleDateString();

    try {
      const users = (await app.client.conversations.members({
        token,
        channel,
      })) as any;
      users.members.forEach(async (user: any) => {
        const preExistingCheckin = await mongooseHandler.getCheckin(date, user);
        console.log("pre-existing checkin: ", preExistingCheckin);

        if (preExistingCheckin === null) {
          // send reminder message & create empty checkin for later

          const checkin = {
            date,
            user,
            answer: "",
            postMessageTS: "",
            channelID: channel,
          };

          // add checkin
          mongooseHandler.addCheckin(checkin, date);

          await app.client.chat.postMessage({
            token,
            channel: user,
            text: `The *${name}* Standup stand-up is about to start.`,
          });
          await app.client.chat.postMessage({
            token,
            channel: user,
            text: questions[0],
          });
        } else {
          await app.client.chat.postMessage({
            token,
            channel: user,
            text: `☕ The *${name}* stand-up is about to start. But I see you already did your checkin, nice 😉`,
          });
        }
      });
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  });
};

(async () => {
  await checkAndPingUsers();
})();
