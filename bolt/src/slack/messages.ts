import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

import { sectionBlock, sectionWithSelect } from "../blocks";
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

    // @todo if the user is in n+ checkins on same date/time we conflict.
    // We should realistically send a channelId in each message metadata
    const preExistingCheckin = await searchForCheckin(user, date);
    const standup = await getStandup(preExistingCheckin?.channelId);

    // cronjob creates partial checkin which we complete here
    if (!preExistingCheckin) {
      say("I'm not sure what checkin this is for?");
      return;
    }

    const questions = standup.questions;
    const answers = preExistingCheckin.answers;

    // @todo if the answers have newlines (i.e. slack bullets)
    // then we exit too early since it counts as another answer
    if (answers.length !== questions.length) {
      answers.push(text);

      const checkin = {
        answers,
        postMessageTs: ts,
      };

      // add checkin
      await updateCheckin(
        preExistingCheckin.channelId,
        checkin,
        preExistingCheckin.id
      );

      if (answers.length !== questions.length) {
        // Post message with block to (skip, use last answer, if 1st question I'm OOO today)
        await client.chat.postMessage({
          channel: message.channel,
          blocks: [
            sectionWithSelect(
              "Quick Action",
              questions[answers.length],
              [
                { text: "I'm OOO today", value: "ooo" },
                { text: "Skip", value: "skip" },
              ],
              "checkinMessageDmQuickResponse"
            ),
          ],
        });
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
            ...questions.map((question: string, index: number) => {
              // if user skipped don't post in channel
              if (question.length === 0) return;

              return {
                color: "E4E4E4",
                blocks: [sectionBlock(`*${question}*\n${answers[index]}`)],
              };
            }),
          ],
          username: userInfo.user.profile.real_name,
          icon_url: userInfo.user.profile.image_192,
        });

        const checkin = {
          answers,
          postMessageTs: postedMessage.ts,
        };

        // update ts for message here
        await updateCheckin(
          preExistingCheckin.channelId,
          checkin,
          preExistingCheckin.id
        );

        say("all done. Thanks!");
      }
    }
  };
