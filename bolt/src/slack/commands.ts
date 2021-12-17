import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

import { scrumbaristaAttachments } from "../blocks";
import { standupBlocks } from "../blocks/standup";
import { newEmptyStandup, Standup } from "../models";
import {
  createCheckin,
  createStandup,
  getCheckin,
  getStandup,
} from "../services/api";

export const scrumbaristaCommand: Middleware<SlackCommandMiddlewareArgs> =
  async ({ ack, command: { channel_id: channel, user_id: user }, client }) => {
    void ack();
    await client.chat.postEphemeral({
      channel,
      attachments: scrumbaristaAttachments,
      user,
    });
  };

export const standupCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command: { channel_id: channelId, trigger_id, channel_name, user_id },
  client,
}) => {
  await ack();

  let standup = await getStandup(channelId);

  if (!standup) {
    standup = await createStandup({
      ...newEmptyStandup,
      name: channel_name,
      channelId,
    });
  }

  await client.views.open({
    trigger_id,
    view: standupBlocks(standup),
  });
};

export const checkinCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command: { user_id: user, channel_id: channel, trigger_id },
  client,
}) => {
  await ack();
  // look for pre-existing checkin
  const date = new Date().toLocaleDateString();

  const checkin = await getCheckin(channel, user, date);
  const standup = await getStandup(channel);

  if (!standup) {
    await client.chat.postEphemeral({
      channel,
      user,
      text: "There's no standup in this channel. Feel free to create one with /standup",
    });
  } else {
    await client.views.open({
      trigger_id,
      view: createCheckin(standup),
    });
  }
};
