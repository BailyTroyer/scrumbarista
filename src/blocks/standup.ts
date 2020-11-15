import { StandupInterface } from "../models";

export const createStandup = (standup: StandupInterface, channelID: string) => {
  if (standup === null) {
    standup = {
      name: "",
      channelID,
      time: "10:00",
      questions: "",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    };
  }

  const days = standup.days.map((d) => ({
    text: {
      type: "plain_text",
      text: d,
    },
    value: d,
  }));

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
          initial_value: standup.name || "",
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
          initial_time: standup.time || "10:00",
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
          initial_options: days,
          options: [
            {
              text: {
                type: "plain_text",
                text: "Monday",
              },
              value: "Monday",
            },
            {
              text: {
                type: "plain_text",
                text: "Tuesday",
              },
              value: "Tuesday",
            },
            {
              text: {
                type: "plain_text",
                text: "Wednesday",
              },
              value: "Wednesday",
            },
            {
              text: {
                type: "plain_text",
                text: "Thursday",
              },
              value: "Thursday",
            },
            {
              text: {
                type: "plain_text",
                text: "Friday",
              },
              value: "Friday",
            },
            {
              text: {
                type: "plain_text",
                text: "Saturday",
              },
              value: "Saturday",
            },
            {
              text: {
                type: "plain_text",
                text: "Sunday",
              },
              value: "Sunday",
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
          initial_value: standup.questions,
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
    private_metadata: JSON.stringify({ channelID: standup.channelID }),
  };
};
