import { Global, Module } from "@nestjs/common";
import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

declare let process: {
  env: {
    SLACK_BOT_TOKEN: string;
    SLACK_SIGNING_SECRET: string;
    NODE_ENV: string;
  };
};

/**
 * ONLY initialized when NODE_ENV == "test"
 *
 * We do this to surpress errors when the slack token/secret
 * are empty (often during CI). Otherwise the following error
 * gets logged during tests: `An API error occurred: not_authed`
 */
class MockWebClient extends WebClient {}

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const boltFactory = {
  provide: "BOLT",
  useFactory: (): WebClient | null => {
    if (process.env.NODE_ENV === "test") {
      return new MockWebClient();
    }
    return new App({ token, signingSecret }).client;
  },
  inject: [],
};

@Global()
@Module({
  imports: [],
  providers: [boltFactory],
  exports: ["BOLT"],
})
export class BoltModule {}
