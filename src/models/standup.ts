import { Document, Schema, model } from 'mongoose';

export interface StandupInterface {
  name: string,
  channelID: string,
  time: string,
  questions: string,
  days: string[]
}

/// Standup Object
export interface IStandup extends Document {
  name: string,
  channelID: string,
  time: string,
  questions: string,
  days: string[]
}
export const StandupSchema = new Schema({
  name: String,
  channelID: String,
  time: String,
  questions: String,
  days: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  }
});
export const Standup = model<IStandup>('Standup', StandupSchema);
