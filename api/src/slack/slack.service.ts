import { Inject, Injectable } from "@nestjs/common";
import { ChatPostMessageResponse, WebClient } from "@slack/web-api";

import { ChannelDto } from "./dto/channel.dto";

@Injectable()
export class SlackService {
  constructor(@Inject("BOLT") private readonly bolt: WebClient) {}

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

  async channelName(channelId: string): Promise<string> {
    const channel = await this.bolt.conversations
      .info({
        channel: channelId,
      })
      .catch(() => null);

    return channel?.channel?.name || "";
  }

  async listUsers(
    channelId: string
  ): Promise<{ name: string; id: string; image: string }[]> {
    return Promise.all(
      await (
        await this.bolt.conversations
          .members({
            channel: channelId,
          })
          .catch(() => null)
      )?.members.map(async (user: string) => {
        const profile = await (
          await this.bolt.users.info({ user }).catch(() => null)
        )?.user.profile;
        return {
          name: profile.real_name || "",
          id: user,
          image: profile.image_192 || "",
        };
      })
    ).catch(() => []);
  }

  async postMessage(
    channel: string,
    text: string
  ): Promise<ChatPostMessageResponse | null> {
    return this.bolt.chat.postMessage({ channel, text }).catch(() => null);
  }
}
