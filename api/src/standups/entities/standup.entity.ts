import { Entity, Column, OneToMany } from "typeorm";

import { Checkin } from "../../checkins/entities/checkin.entity";

export enum Day {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

@Entity()
export class Standup {
  @Column({ unique: true, primary: true })
  channelId: string;

  @Column({ unique: true })
  name: string;

  @Column()
  questions: string;

  @Column({
    type: "enum",
    enum: Day,
  })
  days: Day[];

  @OneToMany(() => Checkin, (checkin) => checkin.standup, { cascade: true })
  checkins: Checkin[];
}
