import mongoose = require('mongoose');
import { StandupInterface, Standup, CheckinInterface, Checkin }  from '../models';

export default class MongooseHandler {
  constructor(connectionString?: string) {
    this.connect_(connectionString || `mongodb://username:password@${process.env.MONGO_DB_HOST}:27017/kanbanista?authSource=admin`)
  }

  connect_(db: string): void {
		mongoose
			.connect(db, { useNewUrlParser: true })
			.then(() => {
				return console.log(`Successfully connected to DB host`);
			})
			.catch((error) => {
				console.log('Error connecting to database: ', error);
				return process.exit(1);
			});
  }

  createStandup(standup: StandupInterface): void {
    console.log('create standup...')
    Standup.update({channelID: standup.channelID}, standup, { upsert: true}, ((error: any, response: any) => {
      if (error) { console.log(error) }
      else {
        console.log('response: ', response)
      }
    }))
  }

  addCheckin(checkin: CheckinInterface, date: string): void {
    Checkin.update({date}, checkin, { upsert: true}, (error: any, response: any) => {
      if (error) { console.log(error) }
      else {
        console.log('response: ', response)
      }
    })
  }

  async listStandups(day: string): Promise<any> {
    return await Standup.find({days: day }, (err, standups) => {
      if (err) { console.log('error: ', err)}
      return standups
    })
  }

  async getStandup(channelID: string): Promise<any> {
    return (await Standup.findOne({ 'channelID': channelID }))
  }

  async getCheckin(date: string, user: string): Promise<any> {
    return (await Checkin.findOne({ date, user }))
  }
}
