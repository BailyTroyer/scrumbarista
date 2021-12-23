import { Entity, Column, OneToMany } from "typeorm";

import { Checkin } from "../../checkins/entities/checkin.entity";
import { Day } from "./day.entity";

// Channels are a single source of truth

@Entity()
export class Standup {
  @Column({ primary: true, default: "" })
  channelId: string;

  @Column({ default: "" })
  name: string;

  @Column({ default: "" })
  questions: string;

  @OneToMany(() => Day, (day) => day.standup, { eager: true })
  days: Day[];

  @OneToMany(() => Checkin, (checkin) => checkin.standup)
  checkins: Checkin[];
}
