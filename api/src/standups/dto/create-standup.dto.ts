import { Day } from "../entities/standup.entity";

export class CreateStandupDto {
  name: string;
  channelId: string;
  questions: string;
  days: Day[];
}
