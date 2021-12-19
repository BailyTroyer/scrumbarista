import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { Standup } from "../../standups/entities/standup.entity";

@Entity()
export class Checkin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  answers: string;

  @Column()
  postMessageTs: string;

  @ManyToOne(() => Standup, (standup) => standup.checkins)
  standup: Standup;

  @Column()
  userId: string;
}
