import { SectionBlock } from "@slack/types";

export const sectionBlock = (text: string): SectionBlock => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text,
  },
});

export const sectionWithSelect = (
  label: string,
  text: string,
  options: { value: string; text: string }[],
  actionId: string
): SectionBlock => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text,
  },
  accessory: {
    type: "static_select",
    placeholder: {
      type: "plain_text",
      text: label,
      emoji: true,
    },
    options: options.map(({ text, value }) => ({
      text: {
        type: "plain_text",
        text,
      },
      value,
    })),
    action_id: actionId,
  },
});

export * from "./scrumbarista";
