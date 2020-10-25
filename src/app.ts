import {
  App,
	ExpressReceiver,
} from '@slack/bolt';

import SlackHandler from './services/slackHandler'

import { handleError } from './core'
import { createStandup, createCheckin, kanbanista } from './blocks'
import MongooseHandler from './services/mongoose'

import { StandupInterface } from './models'

const token = 'xoxb-3389729784-1448821915409-BvtOrRHPbTYfM1DHccDgWDAj'
const signingSecret = '26033c893517faca679b57cea9d6e1f2'

const receiver = new ExpressReceiver({
	signingSecret,
	endpoints: '/slack/events'
});

const mongooseHandler = new MongooseHandler()

// Mount additional routes (does not depend on accessing private properties)
receiver.app.get('/health', (req, res) => {
	res.send(
		JSON.stringify({
			status: 'healthy'
		})
	);
});

// Specify your receiver as the custom receiver for the bolt App
const app = new App({ token, receiver });

// Instantiate Bot Helper Classes
const slackHandler = new SlackHandler(app);

// Help
app.command('/kanbanista', async ({ ack, command, say, context }) => {
  await ack();
	try {
    // show all commands avalable
    await slackHandler.postEphemeral(token, command.channel_id, command.user_id, kanbanista, '')
	} catch (error) {
    console.log('error: ', JSON.stringify(error))
	}
});

// Configure standup
app.command('/standup', async ({ ack, command, say, context }) => {
  await ack();
	try {
    // if standup is null then they are empty i.e. this is a new standup being created
    const preExistingStandup = await mongooseHandler.getStandup(command.channel_id)
    console.log('preexisting standup: ', preExistingStandup)
    await slackHandler.openModal(token, createStandup(preExistingStandup, command.channel_id), command.trigger_id);
	} catch (error) {
    // handleError(token, command.channel_id, command.user_id, slackHandler, error);
    console.log(JSON.stringify(error))
	}
});

// Checkin user
app.command('/checkin', async ({ ack, command, say, context }) => {
  await ack();
	try {

    // look for pre-existing checkin

    const date = new Date().toLocaleDateString()

    const preExistingCheckin = await mongooseHandler.getCheckin(date, command.user_id)

    console.log('preExistingCheckin', preExistingCheckin)


    console.log('command: ', command)

    const preExistingStandup = await mongooseHandler.getStandup(command.channel_id)
    console.log('preexisting standup: ', preExistingStandup)

    if (preExistingStandup === null) {
      // send ephemeral message that no standup exists in the channel
      await slackHandler.postEphemeral(token, command.channel_id, 'user', null, 'There\'s no standup in this channel. Feel free to create one with /standup')
    } else {
      // must run slash command in the channel they belong and/or in a DM
      await slackHandler.openModal(token, createCheckin(preExistingStandup, preExistingCheckin), command.trigger_id);
    }
	} catch (error) {
		handleError(token, command.channel_id, command.user_id, slackHandler, error);
	}
});

// checkin view response
app.view('checkin', async ({ ack, body, context, view, payload }) => {
  await ack();

  try{

    // get selected form fields
    const selectedValues = view.state.values

    const standup = await mongooseHandler.getStandup(JSON.parse(view.private_metadata).channelID)
    const questions = standup.questions.split('\n')
    const standupName = standup.name
    const answers = Object.keys(selectedValues).map(k => selectedValues[k][k].value)
    const date = new Date().toLocaleDateString()

    const channelID = String(JSON.parse(view.private_metadata).channelID)
    const userInfo = await slackHandler.getUser(body.user.id, token)

    const preExistingCheckin = await mongooseHandler.getCheckin(date, body.user.id)

    // if already exists, update timestamp
    // post message, get TS and store that as attribute in mongo
    if (preExistingCheckin !== null) {
      const preExistingCheckinMessageTS = preExistingCheckin.postMessageTS

      const updateStandupMessage = await slackHandler.updateMessage(token, channelID, [
        {
          "color": "#41BC88",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `*${standupName}*\n${date}`
              }
            }
          ]
        },
        ...questions.map((question: string, index: number) => ({
          color: "E4E4E4",
          blocks: [{
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${question}*\n${answers[index]}`
            }
          }]
        }))
      ], [], preExistingCheckinMessageTS)

      console.log("update MESSAGE TS: ", updateStandupMessage.ts)

      const checkin = {
        date,
        user: body.user.id,
        answer: answers.join('\n'),
        postMessageTS: updateStandupMessage.ts as string,
        channelID
      }

      // add checkin
      mongooseHandler.addCheckin(checkin, date)
    } else {
      const standupMessage = await slackHandler.postMessageAttachmentsCustom(token, channelID, [
        {
          "color": "#41BC88",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `*${standupName}*\n${date}`
              }
            }
          ]
        },
        ...questions.map((question: string, index: number) => ({
          color: "E4E4E4",
          blocks: [{
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${question}*\n${answers[index]}`
            }
          }]
        }))
      ], ((userInfo.user as any).profile as any).real_name, ((userInfo.user as any).profile as any).image_192)


      console.log("STANDUP MESSAGE TS: ", standupMessage.ts)

      const checkin = {
        date,
        user: body.user.id,
        answer: answers.join('\n'),
        postMessageTS: standupMessage.ts as string,
        channelID
      }

      // add checkin
      mongooseHandler.addCheckin(checkin, date)
    }
  } catch (error) {
    // send error ephemeral message
    console.log(error)
  }
})

// called when user submits /standup modal
app.view('standup', async ({ ack, body, context, view, payload }) => {
  await ack();

	try {
    // console.log(view.state.values)

    const selectedValues = view.state.values

    const standup: StandupInterface = {
      name: String(selectedValues.name.name.value),
      channelID: String(JSON.parse(view.private_metadata).channelID),
      time: String(selectedValues.time.time.selected_time),
      questions: String(selectedValues.questions.questions.value),
      days: selectedValues.days.days.selected_options.map((d:any) => String(d.value)) as string[]
    }

    mongooseHandler.createStandup(standup)

		// send ephemeral message validating it worked
	} catch (error) {
    // send error ephemeral message
    console.log(error)
	}
});

app.message(/^.*/, async ({ message, say }) => {
  try {
    // Call chat.postMessage with the built-in client
    // const result = await client.chat.postMessage({
    //   channel: welcomeChannelId,
    //   text: `Welcome to the team, <@${event.user.id}>! 🎉 You can introduce yourself in this channel.`
    // });
    console.log('message: ', message)

    if (message.channel_type === 'im') {
      const messageTextAnswer = message.text
      // check for checkin with user ID
      // if already exists && the # answers == # questions then do nothing
      // else push the next answer on the answers
      const date = new Date().toLocaleDateString()
      const userID = message.user

      const preExistingCheckin = await mongooseHandler.getCheckin(date, userID)
      const preExistingStandup = await mongooseHandler.getStandup(preExistingCheckin.channelID)
      console.log('preExistingCheckin: ', preExistingCheckin)
      console.log('preExistingStandup: ', preExistingStandup)

      if (preExistingCheckin != null) {
        // proceed with fetching answer and responding with another question


        // save message, ask next question || end message

        const questions = preExistingStandup.questions.split('\n')
        const answers = !preExistingCheckin.answer ? [] : preExistingCheckin.answer.split('\n')

        if (answers.length === questions.length) {
          // user already answered everything. Send generic feedback message
          await slackHandler.postMessageText(token, message.channel, 'Did you know, that you can share feedback with us and at the same time see what we\'re working on? Hoot this out: https://feedback.olaph.io/', '')
        } else {
          answers.push(messageTextAnswer)

          const checkin = {
            date,
            user: userID,
            answer: answers.join('\n'),
            postMessageTS: '',
            channelID: preExistingCheckin.channelID,
          }

          // add checkin
          mongooseHandler.addCheckin(checkin, date)

          if (answers.length !== questions.length) {
            // return with questions[preExistingAnswers.length]
            await slackHandler.postMessageText(token, message.channel, questions[answers.length], '')
          } else {
            // if answers length == questions length then say standup is done
            await slackHandler.postMessageText(token, message.channel, 'all done. Thanks!', '')

            // submit to main channel

            const userInfo = await slackHandler.getUser(userID, token)

            const standupMessage = await slackHandler.postMessageAttachmentsCustom(token, preExistingStandup.channelID, [
              {
                "color": "#41BC88",
                "blocks": [
                  {
                    "type": "section",
                    "text": {
                      "type": "mrkdwn",
                      "text": `*${preExistingStandup.name}*\n${date}`
                    }
                  }
                ]
              },
              ...questions.map((question: string, index: number) => ({
                color: "E4E4E4",
                blocks: [{
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*${question}*\n${answers[index]}`
                  }
                }]
              }))
            ], ((userInfo.user as any).profile as any).real_name, ((userInfo.user as any).profile as any).image_192)
          }
        }
      } else {
        // send debug message (i.e. :thinking: remind me, what channel channel is this for?)
        // then proceed with that workflow
      }
    }
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
	console.log('Starting Bolt App');
	await app.start(process.env.PORT || 3000);
})();
