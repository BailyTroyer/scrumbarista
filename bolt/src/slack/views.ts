import { Middleware, SlackCommandMiddlewareArgs, SlackViewMiddlewareArgs, SlashCommand, ViewSubmitAction } from "@slack/bolt";
import { sectionBlock } from "../blocks";
import {
  addCheckin,
  getCheckin,
  getStandup,
} from "../services/api";

export const checkinView: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({
    ack,
    body: {
      user: { id: userId },
    },
    view,
    client
  }) => {
    await ack();

    // get selected form fields
    const selectedValues = view.state.values;

    const standup = await getStandup(
      JSON.parse(view.private_metadata).channelID
    );

    const questions = standup.questions.split("\n");
    const answers = Object.keys(selectedValues).map(
      (k) => selectedValues[k][k].value
    );
    const date = new Date().toLocaleDateString();

    const channel = String(JSON.parse(view.private_metadata).channelID);

    const user = await client.users.info({
      user: userId,
      include_locale: true,
    });

    const checkin = await getCheckin(channel, date, userId);

    if (!checkin) {
      const updateStandupMessage = await client.chat.update({
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
        ts: "",
      });

      const checkin = {
        answers: answers.join("\n"),
        postMessageTs: updateStandupMessage.ts as string,
      };

      // add checkin
      addCheckin(channel, user.user.id, checkin, date);
    } else {
      const standupMessage = await client.chat.postMessage({
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
        text: "",
        username: user.user?.profile?.real_name,
        icon_url: user.user?.profile?.image_192,
      });

      const checkin = {
        answers: answers.join("\n"),
        postMessageTs: standupMessage.ts as string,
      };

      addCheckin(channel, user.user.id, checkin, date);
    }
  }