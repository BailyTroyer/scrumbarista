import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

import { sectionBlock } from "../blocks";
import { getCheckin, getStandup, updateCheckin } from "../services/api";

interface SlackMessage {
  channel: string;
  text: string;
  user: string;
  ts: string;
}

export const dmMessage: Middleware<SlackEventMiddlewareArgs<"message">> =
  async ({ say, message, client }) => {
    const { channel, text, user, ts } = message as SlackMessage;

    // only care about DMs
    if (message.channel_type !== "im") return;

    // check for checkin with user ID
    // if already exists && the # answers == # questions then do nothing
    // else push the next answer on the answers
    const date = new Date().toLocaleDateString();

    const preExistingCheckin = await getCheckin(channel, "CHANGE_ME", date);
    const standup = await getStandup(message.channel);

    console.log("preExistingCheckin: ", preExistingCheckin);
    console.log("preExistingStandup: ", standup);

    // cronjob creates partial checkin which we complete here
    if (!preExistingCheckin) {
      say("I'm not sure what checkin this is for?");
      return;
    }

    const questions = standup.questions.split("\n");
    const answers = preExistingCheckin.answers
      .split("\n")
      .filter((x) => x !== "");

    console.log("ANSWERS: ", answers);

    if (answers.length === questions.length) {
      // user already answered everything. Send generic feedback message

      say(
        "Did you know, that you can share feedback with us and at the same time see what we're working on? @todo change this message"
      );
    } else {
      answers.push(text);

      const checkin = {
        answers: answers.join("\n"),
        postMessageTs: ts,
      };

      // add checkin
      await updateCheckin(user, channel, checkin, date);

      if (answers.length !== questions.length) {
        // return with questions[preExistingAnswers.length]
        say(questions[answers.length - 1]);
      } else {
        // if answers length == questions length then say standup is done
        const userInfo = await client.users.info({
          user,
          include_locale: true,
        });

        await client.chat.postMessage({
          channel,
          attachments: [
            {
              color: "#41BC88",
              blocks: [sectionBlock(`*${standup.name}*\n${date}`)],
            },
            ...questions.map((question: string, index: number) => ({
              color: "E4E4E4",
              blocks: [sectionBlock(`*${question}*\n${answers[index]}`)],
            })),
          ],
          username: userInfo.user.profile.real_name,
          icon_url: userInfo.user.profile.image_192,
        });

        say("all done. Thanks!");
      }
    }
  };
