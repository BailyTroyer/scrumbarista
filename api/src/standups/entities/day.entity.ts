import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Standup } from "./standup.entity";

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

// @todo enforce uniqueness of days per standup (i.e. prevent two Mondays)

@Entity()
export class Day {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Standup, (standup) => standup.days)
  standup: Standup;

  @Column({
    type: "enum",
    enum: DayOfWeek,
  })
  day: DayOfWeek;
}
