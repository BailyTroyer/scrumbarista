import { Inject, Injectable } from "@nestjs/common";
import { WebClient } from "@slack/web-api";

import { ChannelDto } from "./dto/channel.dto";

@Injectable()
export class SlackService {
  constructor(@Inject("BOLT") private bolt: WebClient) {}

  async listChannels(): Promise<ChannelDto[]> {
    const response = await this.bolt.conversations.list({
      exclude_archived: true,
    });

    return (
      response.channels
        .filter((c) => c.is_channel)
        .map((c) => ({ name: c.name, id: c.id })) || []
    );
  }
}
