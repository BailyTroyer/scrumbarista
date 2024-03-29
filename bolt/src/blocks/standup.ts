import { PlainTextOption, View } from "@slack/types";

import { Standup } from "../models";
import { timezones } from "../utils/time";

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

  // API stores seconds (we only need HH:MM)
  const standupTime = standup?.startTime.slice(0, -3) || "09:00";

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
          initial_time: standupTime,
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
        block_id: "tz",
        text: {
          type: "mrkdwn",
          text: "Pick a Timezone",
        },
        accessory: {
          action_id: "tz",
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select tz",
          },
          ...(standup?.timezone
            ? {
                initial_option: {
                  text: {
                    type: "plain_text",
                    text: standup?.timezone,
                  },
                  value: standup.timezone,
                },
              }
            : null),
          options: timezones.map(({ name }) => ({
            text: {
              type: "plain_text",
              text: name,
            },
            value: name,
          })),
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
            text: "Enter questions separated by linebreak; You can use {last_checkin} for the last checkin date.",
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
  channelId: string,
  userId: string
): View => {
  const defaultTimezone = standup.timezone;
  const userTimezone = standup.timezoneOverrides.find(
    (override) => override.userId === userId
  )?.timezone;

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
          initial_option: {
            text: {
              type: "plain_text",
              text: userTimezone || defaultTimezone,
            },
            value: userTimezone || defaultTimezone,
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
