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
};

export type Standup = NewStandup & {
  id: string;
};

export const newEmptyStandup: NewStandup = {
  name: "",
  channelId: "",
  questions: "",
  days: [],
};

export type Checkin = {
  createdDate: Date;
  answers: string;
  postMessageTs: string;
};

export type CreateCheckinDTO = {
  answers: string;
  postMessageTs: string;
};
