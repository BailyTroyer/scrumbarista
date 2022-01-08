import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ScheduledCheckin {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  interval: string;
}
