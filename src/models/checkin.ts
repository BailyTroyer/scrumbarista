import { Document, Schema, model } from 'mongoose';

export interface CheckinInterface {
  date: string,
  user: string,
  answer: string,
  postMessageTS: string,
  channelID: string,
}


/// Checkin Object
export interface ICheckin extends Document {
  date: string,
  user: string,
  answer: string,
  postMessageTS: string,
  channelID: string,
}
export const CheckinSchema = new Schema({
  date: String,
  user: String,
  answer: String,
  postMessageTS: String,
  channelID: String,
})
export const Checkin = model<ICheckin>('Checkin', CheckinSchema)
