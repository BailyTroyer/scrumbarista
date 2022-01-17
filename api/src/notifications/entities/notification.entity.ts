import { Entity, Column } from "typeorm";

abstract class Notification {
  @Column({ primary: true, default: "" })
  channelId: string;

  @Column()
  interval: string;
}

@Entity()
export class StandupNotification extends Notification {}

@Entity()
export class UserStandupNotification extends Notification {
  @Column({ unique: true })
  userId: string;
}
