import { Module } from "@nestjs/common";
import { App } from "@slack/bolt";
import { WebClient } from "@slack/web-api";

declare let process: {
  env: {
    SLACK_BOT_TOKEN: string;
    SLACK_SIGNING_SECRET: string;
  };
};

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const boltFactory = {
  provide: "BOLT",
  useFactory: (): WebClient => {
    return new App({ token, signingSecret }).client;
  },
  inject: [],
};

@Module({
  providers: [boltFactory],
  exports: ["BOLT"],
})
export class BoltModule {}
