import { StandupInterface, CheckinInterface } from '../models'

export const createCheckin = (standup: StandupInterface, preExistingCheckin: CheckinInterface) => {

  var preExistingAnswers: string[] = []

  if (preExistingCheckin !== null) {
    preExistingAnswers = preExistingCheckin.answer.split('\n') || []
  }

  // console.log(preExistingCheckin)
  // console.log('preExistingAnswers: ', preExistingAnswers)

  const questions = standup.questions.split('\n').map((q: any, i: any) => ({
    "type": "input",
    "block_id": String(i),
    "element": {
      "type": "plain_text_input",
      "multiline": true,
      "initial_value": preExistingAnswers.length > 0 ? preExistingAnswers[i] : "",
      "action_id": String(i)
    },
    "label": {
      "type": "plain_text",
      "text": q,
      "emoji": true
    }
  }))

  return {
    type: 'modal',
    callback_id: 'checkin',
    title: {
      type: 'plain_text',
      text: 'Manual Checkin',
    },
    blocks: questions,
    submit: {
      type: 'plain_text',
      text: 'Submit'
    },
    private_metadata: JSON.stringify({channelID: standup.channelID})
  }

}
