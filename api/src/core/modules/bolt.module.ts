import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

/**
 * ONLY initialized when NODE_ENV == "test"
 *
 * We do this to surpress errors when the slack token/secret
 * are empty (often during CI). Otherwise the following error
 * gets logged during tests: `An API error occurred: not_authed`
 */
class MockWebClient extends WebClient {}

const boltFactory = {
  provide: "BOLT",
  useFactory: (configService: ConfigService): WebClient | null => {
    const nodeEnv = configService.get<string>("nodeEnv");
    if (nodeEnv === "test") {
      return new MockWebClient();
    }

    const signingSecret = configService.get<string>("slack.signingSecret");
    const token = configService.get<string>("slack.botToken");

    return new App({ token, signingSecret }).client;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [boltFactory],
  exports: ["BOLT"],
})
export class BoltModule {}
