import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";

import { scrumbaristaAttachments } from "../blocks";
import { standupBlocks } from "../blocks/standup";
import { createCheckin, getCheckins, getStandup } from "../services/api";

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
  command: { channel_id: channelId, trigger_id },
  client,
}) => {
  await ack();

  const standup = await getStandup(channelId);
  await client.views.open({
    trigger_id,
    view: standupBlocks(standup, channelId),
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

  const checkins = await getCheckins(channel, user, date);
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
      view: createCheckin(standup, checkins[0]),
    });
  }
};

/**
 * Generates a random ordering of all users in the specified channel
 */
export const randomOrderCommand: Middleware<SlackCommandMiddlewareArgs> =
  async ({ ack, command: { channel_id: channel, user_id: user }, client }) => {
    await ack();

    // Get users in channel
    const members = await client.conversations.members({ channel });

    // For each user get their real name
    const users = await Promise.all(
      members.members.map(
        async (user) => (await client.users.info({ user })).user.name
      )
    );

    await client.chat.postEphemeral({
      channel,
      text: users.join(","),
      user,
    });
  };

/**
 * Generates a random user based on the specified slack channel user list
 */
export const randomPersonCommand: Middleware<SlackCommandMiddlewareArgs> =
  async ({ ack, command: { channel_id: channel, user_id: user }, client }) => {
    await ack();

    // Get users in channel
    const members = await client.conversations.members({ channel });

    // Fetch user list
    const memberList = members.members;

    // Get random index in array
    const randomUser =
      memberList[Math.floor(Math.random() * memberList.length)];

    // Fetch real name (not userId)
    const name = await (
      await client.users.info({ user: randomUser })
    ).user.name;

    await client.chat.postEphemeral({
      channel,
      text: name,
      user,
    });
  };

/**
 * Fetches a random "Interesting thing of the week" to do
 */
export const itotwCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
}) => {
  await ack();
};

/**
 * Saves a new "Interesting thing of the week" idea for later use
 */
export const saveItotwCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
}) => {
  await ack();
};
