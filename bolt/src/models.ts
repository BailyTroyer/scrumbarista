export enum Day {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export type NewStandup = {
  name: string;
  channelId: string;
  questions: string;
  days: Day[];
  startTime: string;
  introMessage: string;
};

export type Standup = NewStandup & {
  id: string;
};

export type Checkin = {
  createdDate: Date;
  answers: string;
  postMessageTs: string;
  id: string;
};

export type CreateCheckinDTO = {
  answers: string;
  postMessageTs: string;
};
