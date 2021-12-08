import { PartialType } from "@nestjs/mapped-types";

import { Day } from "../entities/standup.entity";
import { CreateStandupDto } from "./create-standup.dto";

export class UpdateStandupDto extends PartialType(CreateStandupDto) {
  name?: string;
  channelId?: string;
  questions?: string;
  days?: Day[];
}
