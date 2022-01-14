import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  interval: string;
}
