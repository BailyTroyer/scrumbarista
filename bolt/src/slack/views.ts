import {
  Middleware,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from "@slack/bolt";

import { sectionBlock } from "../blocks";
import { Day, NewStandup } from "../models";
import {
  addCheckin,
  createStandup,
  getCheckin,
  getStandup,
} from "../services/api";

export const standupView: Middleware<
  SlackViewMiddlewareArgs<ViewSubmitAction>
> = async ({
  ack,
  view,
  client,
  body: {
    user: { id: userId },
  },
}) => {
  await ack();

  const selectedValues = view.state.values;

  const name: string = selectedValues.name.name.value;
  const channelId: string = JSON.parse(view.private_metadata).channelId;

  // missing time attribute
  const standup: NewStandup = {
    name,
    channelId,
    questions: String(selectedValues.questions.questions.value),
    days: selectedValues.days.days.selected_options.map((d: any) =>
      String(d.value)
    ) as Day[],
  };

  const createdStandup = await createStandup(standup);

  if (!createdStandup) {
    await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `I was unable to update ${name}`,
    });
  } else {
    await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: `I've updated ${createdStandup.name}`,
    });
  }
};

export const checkinView: Middleware<
  SlackViewMiddlewareArgs<ViewSubmitAction>
> = async ({
  ack,
  body: {
    user: { id: userId },
  },
  view,
  client,
}) => {
  await ack();

  // get selected form fields
  const selectedValues = view.state.values;

  const standup = await getStandup(JSON.parse(view.private_metadata).channelId);

  // if standup DNE post ephemeral message no standup

  const questions = standup.questions.split("\n");
  const answers = Object.keys(selectedValues).map(
    (k) => selectedValues[k][k].value
  );
  const date = new Date().toLocaleDateString();

  const channel = String(JSON.parse(view.private_metadata).channelId);

  const user = await client.users.info({
    user: userId,
    include_locale: true,
  });

  const checkin = await getCheckin(channel, userId, date);

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
    addCheckin(user.user.id, channel, checkin, date);
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
      username: user.user.profile.real_name,
      icon_url: user.user.profile.image_192,
    });

    const checkin = {
      answers: answers.join("\n"),
      postMessageTs: standupMessage.ts as string,
    };

    addCheckin(user.user.id, channel, checkin, date);
  }
};
