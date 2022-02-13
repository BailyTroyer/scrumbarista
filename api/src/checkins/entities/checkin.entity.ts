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

  @Column({ type: "json" })
  answers: string[];

  @Column({ default: "" })
  postMessageTs: string;

  @ManyToOne(() => Standup, (standup) => standup.checkins, {
    onDelete: "CASCADE",
  })
  standup: Standup;

  @Column({ default: false })
  outOfOffice: boolean;

  @Column()
  userId: string;
}
