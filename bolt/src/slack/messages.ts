import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

import { sectionBlock } from "../blocks";
import { getStandup, searchForCheckin, updateCheckin } from "../services/api";

interface SlackMessage {
  text: string;
  user: string;
  ts: string;
}

export const dmMessage: Middleware<SlackEventMiddlewareArgs<"message">> =
  async ({ say, message, client }) => {
    const { text, user, ts } = message as SlackMessage;

    // only care about DMs
    if (message.channel_type !== "im") return;

    // check for checkin with user ID
    const date = new Date().toLocaleDateString();

    const preExistingCheckin = await searchForCheckin(user, date);
    const standup = await getStandup(preExistingCheckin?.channelId);

    // cronjob creates partial checkin which we complete here
    if (!preExistingCheckin) {
      say("I'm not sure what checkin this is for?");
      return;
    }

    const questions = standup.questions.split("\n");
    const answers = preExistingCheckin.answers
      .split("\n")
      .filter((x) => x !== "");

    if (answers.length !== questions.length) {
      answers.push(text);

      const checkin = {
        answers: answers.join("\n"),
        postMessageTs: ts,
      };

      // add checkin
      const updatedCheckin = await updateCheckin(
        preExistingCheckin.channelId,
        checkin,
        preExistingCheckin.id
      );

      if (answers.length !== questions.length) {
        // return with questions[preExistingAnswers.length]
        say(questions[answers.length]);
      } else {
        // if answers length == questions length then say standup is done
        const userInfo = await client.users.info({
          user,
          include_locale: true,
        });

        const postedMessage = await client.chat.postMessage({
          channel: preExistingCheckin.channelId,
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
