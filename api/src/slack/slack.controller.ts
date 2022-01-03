import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { plainToClass } from "class-transformer";

import { ChannelDto } from "./dto/channel.dto";
import { SlackService } from "./slack.service";

@ApiTags("slack")
@Controller("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Get("channels")
  @ApiOperation({ summary: "list channels" })
  @ApiResponse({ status: 200, description: "channels found" })
  async create(): Promise<ChannelDto[]> {
    return plainToClass(ChannelDto, await this.slackService.listChannels());
  }
}
