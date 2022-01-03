import { Entity, Column, OneToMany } from "typeorm";

import { Checkin } from "../../checkins/entities/checkin.entity";
import { Day } from "./day.entity";

// Channels are a single source of truth
/**  Saving times @see https://stackoverflow.com/questions/63976442/how-to-validate-date-and-time-in-typeorm-and-nestjs */

@Entity()
export class Standup {
  @Column({ primary: true, default: "" })
  channelId: string;

  @Column({ default: "" })
  name: string;

  @Column({ default: "" })
  questions: string;

  @Column("time")
  startTime: Date;

  @Column("bool", { default: true })
  active: boolean;

  @Column({ default: "" })
  introMessage: string;

  @OneToMany(() => Day, (day) => day.standup, { eager: true })
  days: Day[];

  @OneToMany(() => Checkin, (checkin) => checkin.standup)
  checkins: Checkin[];
}
