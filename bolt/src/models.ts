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
  questions: string[];
  days: Day[];
  startTime: string;
  introMessage: string;
  timezone: string;
};

export type TimezoneOverride = { timezone: string; userId: string };

export type Standup = NewStandup & {
  id: string;
  timezoneOverrides: TimezoneOverride[];
};

export type Checkin = {
  outOfOffice: boolean;
  createdDate: Date;
  answers: string[];
  postMessageTs: string;
  id: string;
};

export type CreateCheckinDTO = {
  answers: string[];
  postMessageTs: string;
  outOfOffice?: boolean;
};
