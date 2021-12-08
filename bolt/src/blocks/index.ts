import { SectionBlock } from "@slack/types";

export const sectionBlock = (text: string): SectionBlock => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text,
  },
});

export * from "./scrumbarista";
