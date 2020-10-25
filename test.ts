import mongoose = require('mongoose');
import { StandupInterface, Standup } from './src/models'

import { App } from '@slack/bolt';

const token = 'xoxb-3389729784-1448821915409-BvtOrRHPbTYfM1DHccDgWDAj';
const signingSecret = '26033c893517faca679b57cea9d6e1f2'
const app = new App({ token, clientSecret: signingSecret })

(async () => {
  console.log("testing")

  mongoose
			.connect(`mongodb://username:password@localhost:27017/kanbanista?authSource=admin`, { useNewUrlParser: true })
			.then(() => {
				return console.log(`Successfully connected to DB host`);
			})
			.catch((error) => {
				console.log('Error connecting to database: ', error);
				return process.exit(1);
			});

  // const testStandup: StandupInterface = {
  //   name: 'test1',
  //   channelID: 'test',
  //   time: '9:00',
  //   questions: 'q1',
  //   days: ['Monday']
  // }
  // const standupThing = new Standup(testStandup).save((error: any, response: any) => {
  //   console.log("SAVING NEW STANDUP")
  //   if (error) { console.log(error) }
  //   else {
  //     console.log('response: ', response)
  //   }
  // })
  // console.log("standupThing: ", standupThing)
  // console.log((await Standup.findOne({ 'channelID': 'dne' })))


  // Standup.findOneAndUpdate({channelID: 'test'}, testStandup, { new: true, upsert: true}, ((error: any, response: any) => {
  //   if (error) { console.log(error) }
  //   else {
  //     console.log('response: ', response)
  //   }
  // }))

  app.client.conversations.members({ token: 'xoxb-3389729784-1448821915409-BvtOrRHPbTYfM1DHccDgWDAj', channel: 'G01CUBQRL91'})

  await Standup.find({days: "Friday" }, (err, standups) => {
    console.log(standups)
  })

  // console.log(await Standup.findOne({ 'channelID': 'G01CUBQRL91' }))
})();
