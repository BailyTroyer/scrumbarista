import { View } from "@slack/types";
import fetch from "node-fetch";

import { Checkin, CreateCheckinDTO, NewStandup, Standup } from "../models";

declare let process: {
  env: {
    API_URL: string;
  };
};

const API_URL = process.env.API_URL || "http://localhost:8000";

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
  const response = await fetch(
    `${API_URL}/standups/${channelId}/checkins?userId=${userId}&date=${date}`
  ).catch(() => null);

  if (response?.ok) {
    return response?.json();
  }

  return null;
};

/**
 * Creates a given checkin for a standup.
 * @param standup the standup to append the checkin to.
 * @param checkin the checkin being authored.
 */
export const createCheckin = (standup: Standup, checkin?: Checkin): View => {
  const answers = checkin?.answers.split("\n") || [];
  const questions = standup.questions.split("\n");

  const blocks = questions.map((question: string, i: number) => ({
    type: "input",
    block_id: String(i),
    element: {
      type: "plain_text_input",
      multiline: true,
      initial_value: answers.length > 0 ? answers[i] : "",
      action_id: String(i),
    },
    label: {
      type: "plain_text",
      text: question,
      emoji: true,
    },
  }));

  return {
    type: "modal",
    callback_id: "checkin",
    title: {
      type: "plain_text",
      text: "Manual Checkin",
    },
    blocks,
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    private_metadata: JSON.stringify({ channelId: standup.channelId }),
  };
};

/**
 * Fetches a given standup in a slack channel.
 * @param channelId the channel the standup exists in.
 * @async
 */
export const getStandup = async (
  channelId: string
): Promise<Standup | null> => {
  const response = await fetch(`${API_URL}/standups/${channelId}`).catch(
    () => null
  );

  if (response?.ok) {
    return response?.json();
  }

  return null;
};

// filter by date
export const listStandups = async (day: string): Promise<Standup[] | null> => {
  const response = await fetch(`${API_URL}/standups?day=${day}`).catch(
    () => null
  );

  if (response?.ok) {
    return response?.json();
  }

  return null;
};

// default name to channel name
export const createStandup = async (
  newStandup: NewStandup
): Promise<Standup | null> => {
  const response = await fetch(`${API_URL}/standups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStandup),
  }).catch(() => null);

  if (response.ok) {
    return response?.json();
  }

  return null;
};

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
  ).catch(() => null);
  return response?.json();
};

export const updateCheckin = async (
  userId: string,
  channelId: string,
  checkin: CreateCheckinDTO,
  date: string
) => {
  const response = await fetch(
    `${API_URL}/standups/${channelId}/checkins?userId=${userId}&date=${date}`,
    {
      method: "PATCH",
      body: JSON.stringify(checkin),
    }
  ).catch(() => null);
  return response?.json();
};
