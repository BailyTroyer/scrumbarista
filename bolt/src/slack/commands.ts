import { Middleware, SlackCommandMiddlewareArgs, SlashCommand } from "@slack/bolt";
import { scrumbaristaAttachments } from "../blocks";
import {
  addCheckin,
  createCheckin,
  createStandup,
  getCheckin,
  getStandup,
} from "../services/api";

export const scrumbaristaCommand: Middleware<SlackCommandMiddlewareArgs> = async ({ ack, command: { channel_id: channel, user_id: user }, client }) => {
  void ack();
  await client.chat.postEphemeral({ channel, attachments: scrumbaristaAttachments, user });
}

export const standupCommand: Middleware<SlackCommandMiddlewareArgs> = async ({ ack, command: { channel_id, trigger_id }, client }) => {
  await ack();

  const standup = await getStandup(channel_id);

  await client.views.open({
    trigger_id,
    view: createStandup(standup, channel_id),
  });
}

export const checkinCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command: { user_id: user, channel_id: channel, trigger_id }, client
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
      view: createCheckin(standup, checkin),
    });
  }
}