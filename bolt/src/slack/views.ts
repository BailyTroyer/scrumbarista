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
  getCheckins,
  getStandup,
  updateCheckin,
  updateStandup,
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
  const startTime: string = selectedValues.time.time.selected_time;

  // check if standup already exists
  const standup = await getStandup(channelId);
  const newStandup: NewStandup = {
    name,
    channelId,
    questions: selectedValues.questions.questions.value.split("\n"),
    days: selectedValues.days.days.selected_options.map((d: any) =>
      String(d.value)
    ) as Day[],
    startTime,
    introMessage: "",
  };

  if (standup) {
    const updatedStandup = await updateStandup(channelId, newStandup);
    await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: updatedStandup
        ? `I've updated ${updatedStandup.name}`
        : `I was unable to update ${standup.name}`,
    });
  } else {
    const createdStandup = await createStandup(newStandup);
    await client.chat.postEphemeral({
      channel: channelId,
      user: userId,
      text: createdStandup
        ? `I've created ${createdStandup.name}`
        : `I was unable to create ${newStandup.name}`,
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
  const questions = standup.questions;
  const answers = Object.keys(selectedValues).map(
    (k) => selectedValues[k][k].value
  );
  const date = new Date().toLocaleDateString();

  const channel = String(JSON.parse(view.private_metadata).channelId);

  const user = await client.users.info({
    user: userId,
    include_locale: true,
  });

  const checkins = (await getCheckins(channel, userId, date)) || [];

  if (checkins.length === 0) {
    const updateStandupMessage = await client.chat.postMessage({
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
      username: user.user.profile.real_name,
      icon_url: user.user.profile.image_192,
    });

    const createCheckinDto = {
      answers,
      postMessageTs: updateStandupMessage.ts,
      userId: user.user.id,
    };

    // add checkin
    await addCheckin(channel, createCheckinDto);
  } else {
    const standupMessage = await client.chat.update({
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
      username: user.user.profile.real_name,
      icon_url: user.user.profile.image_192,
      ts: checkins[0].postMessageTs,
    });

    const updateCheckinDto = {
      answers,
      postMessageTs: standupMessage.ts,
    };

    // update checkin
    await updateCheckin(channel, updateCheckinDto, checkins[0].id);
  }
};
