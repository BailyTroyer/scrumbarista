import mongoose = require("mongoose");
import {
  StandupInterface,
  Standup,
  CheckinInterface,
  Checkin,
} from "../models";

export default class MongooseHandler {
  /**
   * Represents Mongo instance handler.
   * @constructor
   * @param {string} connectionString - Mongo DB URL.
   */
  constructor(connectionString?: string) {
    this.connect_(
      connectionString ||
        `mongodb://username:password@${process.env.MONGO_DB_HOST}:27017/scrumbarista?authSource=admin`
    );
  }

  /**
   * Connects to MongoDB instance.
   *
   * @param {string} db - Database connection string
   * @return {void}
   *
   * @example
   *
   *     connect_('mongodb://username:password@$localhost:27017/databasename?authSource=admin')
   */
  connect_(db: string): void {
    mongoose
      .connect(db, { useNewUrlParser: true })
      .then(() => {
        return console.log(`Successfully connected to DB host`);
      })
      .catch((error) => {
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });
  }

  /**
   * Create/Update a standup
   *
   * @param {StandupInterface} standup - Slack channel's standup
   * @return {void}
   *
   * @example
   *
   *     createStandup({name: 'name', channelID: 'channel', time: 'time', questions: 'a\nb\nc', days: ['monday', 'tuesday']})
   */
  createStandup(standup: StandupInterface): void {
    console.log("create standup...");
    Standup.update(
      { channelID: standup.channelID },
      standup,
      { upsert: true },
      (error: any, response: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log("response: ", response);
        }
      }
    );
  }

  /**
   * Create/Update a checkin
   *
   * @param {CheckinInterface} checkin - User's checkin
   * @return {void}
   *
   * @example
   *
   *     addCheckin({date: 'date', user: 'userID', answer: 'a\nb\nc', postMessageTS: 'messageTS', channelID: 'channelID'})
   */
  addCheckin(checkin: CheckinInterface, date: string): void {
    Checkin.update(
      { date },
      checkin,
      { upsert: true },
      (error: any, response: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log("response: ", response);
        }
      }
    );
  }

  /**
   * List standups for a given date
   *
   * @param {string} date - Date standup's are done
   * @return {Promise<StandupInterface[]>}
   *
   * @example
   *
   *     listStandups('5/9/2020')
   */
  async listStandups(day: string): Promise<any> {
    return await Standup.find({ days: day }, (err, standups) => {
      if (err) {
        console.log("error: ", err);
      }
      return standups;
    });
  }

  /**
   * Get a standup for a given slack channel ID
   *
   * @param {string} channelID - Slack channel's ID
   * @return {Promise<StandupInterface>}
   *
   * @example
   *
   *     getStandup('channelID')
   */
  async getStandup(channelID: string): Promise<any> {
    return await Standup.findOne({ channelID: channelID });
  }

  /**
   * Get a checkin response for a given date and slack userID
   *
   * @param {string} date - Date of checkin
   * @param {string} user - Slack channel's ID
   * @return {Promise<CheckinInterface>}
   *
   * @example
   *
   *     getCheckin('channelID', user: 'userID')
   */
  async getCheckin(date: string, user: string): Promise<any> {
    return await Checkin.findOne({ date, user });
  }
}
