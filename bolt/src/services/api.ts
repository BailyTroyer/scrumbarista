import fetch from "node-fetch";

import { View } from "@slack/types";

import { Checkin, CreateCheckinDTO, Standup } from "../models";

declare let process: {
  env: {
    API_URL: string;
  };
};

const API_URL = process.env.API_URL || 'http://localhost:8000';

/**
 * Fetches a given checkin for a channel.
 *
 * @param channelId the slack channel the checkin was posted in.
 * @param userId the user that authored the checkin.
 * @param date the date the checkin was created.
 * @async
 */
export const getCheckin = async (
  channelId: string,
  userId: string,
  date: string
): Promise<Checkin | null> => {
  return fetch(
    `${API_URL}/standups/${channelId}/checkins?userId=${userId}&date=${date}`
  )
  .then(async res => {
    if (res.ok) {
      return await res.json() as Checkin;
    }
    return null
  })
  .catch(err => {
    return null
  });
};

/**
 * Creates a given checkin for a standup.
 * @param standup the standup to append the checkin to.
 * @param checkin the checkin being authored.
 */
export const createCheckin = (standup: Standup, checkin: any): View => ({
  type: "modal",
  callback_id: "checkin",
  title: {
    type: "plain_text",
    text: "Manual Checkin",
  },
  blocks: [],
  submit: {
    type: "plain_text",
    text: "Submit",
  },
  private_metadata: JSON.stringify({ channelID: standup.channelId }),
});

/**
 * Fetches a given standup in a slack channel.
 * @param channelId the channel the standup exists in.
 * @async
 */
export const getStandup = async (channelId: string): Promise<Standup | null> => {
  return fetch(`${API_URL}/standups?channelId=${channelId}`)
  .then(async res => {
    if (res.ok) {
      return await res.json() as Standup;
    }
    return null
  })
  .catch(err => {
    return null
  });
};

/**
 * Creates a standup modal.
 * @param standup the standup to create a model for.
 * @param channelId the channel the standup resides in.
 */
export const createStandup = (standup: any, channelId: string): View => ({
  type: "modal",
  callback_id: "standup",
  title: {
    type: "plain_text",
    text: "Configure Standup",
  },
  blocks: [],
  submit: {
    type: "plain_text",
    text: "Submit",
  },
  private_metadata: JSON.stringify({ channelID: standup.channelID }),
});

export const addCheckin = async (
  userId: string,
  channelId: string,
  checkin: CreateCheckinDTO,
  date: string
) => {
  const response = await fetch(
    `${API_URL}/standups/${channelId}/checkins?userId=${userId}&date=${date}`,
    {
      method: "POST",
      body: JSON.stringify(checkin),
    }
  );
  return await response.json();
};
