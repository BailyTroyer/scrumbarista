import { StandupInterface, CheckinInterface } from "../models";

export const createCheckin = (
  standup: StandupInterface,
  preExistingCheckin: CheckinInterface
) => {
  const questions = standup.questions.split("\n");
  var answers: string[] = [];

  if (preExistingCheckin) {
    answers = preExistingCheckin.answer.split("\n") || [];
  }
  // const answers = !preExistingCheckin.answer ? [] : preExistingCheckin.answer.split('\n')

  const blocks = questions.map((q: any, i: any) => ({
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
      text: q,
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
    blocks: blocks,
    submit: {
      type: "plain_text",
      text: "Submit",
    },
    private_metadata: JSON.stringify({ channelID: standup.channelID }),
  };
};
