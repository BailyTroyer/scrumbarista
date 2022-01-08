import { PlainTextOption, View } from "@slack/types";

import { Standup } from "../models";

const timezones: { name: string; relative }[] = [
  { name: "GMT", relative: 0 },
  { name: "UTC", relative: 0 },
  { name: "ECT", relative: 1 },
  { name: "EET", relative: 2 },
  { name: "ART", relative: 2 },
  { name: "EAT", relative: 3 },
  { name: "MET", relative: 3.5 },
  { name: "NET", relative: 4 },
  { name: "PLT", relative: 5 },
  { name: "IST", relative: 5.5 },
  { name: "BST", relative: 6 },
  { name: "VST", relative: 7 },
  { name: "CTT", relative: 8 },
  { name: "JST", relative: 9 },
  { name: "ACT", relative: 9.5 },
  { name: "AET", relative: 10 },
  { name: "SST", relative: 11 },
  { name: "NST", relative: 12 },
  { name: "MIT", relative: -11 },
  { name: "HST", relative: -10 },
  { name: "AST", relative: -9 },
  { name: "PST", relative: -8 },
  { name: "PNT", relative: -7 },
  { name: "MST", relative: -7 },
  { name: "CST", relative: -6 },
  { name: "EST", relative: -5 },
  { name: "IET", relative: -5 },
  { name: "PRT", relative: -4 },
  { name: "CNT", relative: -3 },
  { name: "AGT", relative: -3 },
  { name: "BET", relative: -3 },
  { name: "CAT", relative: -1 },
];

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const standupBlocks = (
  standup: Standup | null,
  channelId: string
): View => {
  const days: PlainTextOption[] =
    standup?.days.map((d) => ({
      text: {
        type: "plain_text",
        text: capitalize(d.toString()),
      },
      value: d.toString(),
    })) || [];

  return {
    type: "modal",
    callback_id: "standup",
    title: {
      type: "plain_text",
      text: "Configure Standup",
    },
    blocks: [
      {
        type: "input",
        block_id: "name",
        element: {
          type: "plain_text_input",
          action_id: "name",
          placeholder: {
            type: "plain_text",
            text: "Enter a name for the stand-up",
          },
          initial_value: standup?.name || "",
        },
        label: {
          type: "plain_text",
          text: "Name",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "time",
        element: {
          type: "timepicker",
          initial_time: "16:20",
          placeholder: {
            type: "plain_text",
            text: "Select time",
            emoji: true,
          },
          action_id: "time",
        },
        label: {
          type: "plain_text",
          text: "Time",
          emoji: true,
        },
      },
      {
        type: "section",
        block_id: "days",
        text: {
          type: "mrkdwn",
          text: "Pick Stand-Up Days",
        },
        accessory: {
          action_id: "days",
          type: "multi_static_select",
          placeholder: {
            type: "plain_text",
            text: "Select items",
          },
          ...(days.length > 0 ? { initial_options: days } : null),
          options: [
            {
              text: {
                type: "plain_text",
                text: "Monday",
              },
              value: "monday",
            },
            {
              text: {
                type: "plain_text",
                text: "Tuesday",
              },
              value: "tuesday",
            },
            {
              text: {
                type: "plain_text",
                text: "Wednesday",
              },
              value: "wednesday",
            },
            {
              text: {
                type: "plain_text",
                text: "Thursday",
              },
              value: "thursday",
            },
            {
              text: {
                type: "plain_text",
                text: "Friday",
              },
              value: "friday",
            },
            {
              text: {
                type: "plain_text",
                text: "Saturday",
              },
              value: "saturday",
            },
            {
              text: {
                type: "plain_text",
                text: "Sunday",
              },
              value: "sunday",
            },
          ],
        },
      },
      {
        type: "input",
        block_id: "questions",
        element: {
          type: "plain_text_input",
          multiline: true,
          initial_value: standup?.questions.join("\n") || "",
          action_id: "questions",
        },
        label: {
          type: "plain_text",
          text: "Questions",
          emoji: true,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "plain_text",
            text: "Enter the stand-up questions, separated by linebreak",
          },
        ],
      },
    ],
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    private_metadata: JSON.stringify({ channelId }),
  };
};

export const userConfigBlocks = (
  standup: Standup | null,
  channelId: string
): View => {
  return {
    type: "modal",
    callback_id: "standupUserConfig",
    title: {
      type: "plain_text",
      text: "Personal Standup",
    },
    blocks: [
      {
        type: "section",
        block_id: "tz",
        text: {
          type: "mrkdwn",
          text: "Pick your timezone",
        },
        accessory: {
          action_id: "tz",
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select timezone",
          },

          options: timezones.map(({ name }) => ({
            text: {
              type: "plain_text",
              text: name,
            },
            value: name,
          })),
        },
      },
    ],
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    private_metadata: JSON.stringify({ channelId }),
  };
};
