import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { App, ExpressReceiver } from "@slack/bolt";

import { AppModule } from "./app.module";
import { SlackBoltService } from "./core/modules/slack.module";

export const setupBolt = (app: INestApplication): void => {
  // Fetch slack service (w/ all Nest dependencies [standupService, checkinService, etc])
  const slackBoltService = app.get(SlackBoltService);
  const configService = app.get(ConfigService);

  const receiver = new ExpressReceiver({
    signingSecret: configService.get<string>("slack.signingSecret"),
    endpoints: "/",
  });
  const slackApp = new App({
    token: configService.get<string>("slack.botToken"),
    receiver,
  });

  // Use NestJS as BoltJS proxy
  app.use("/slack/events", receiver.router);

  // Register event handlers
  slackApp.command("/scrumbarista", slackBoltService.scrumbaristaCommand);
};

(async () => {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Scrumbarista API")
    .setDescription("Standup Management")
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Init slack handlers (/slack/events)
  setupBolt(app);

  await app.listen(process.env.PORT || 8000);
})();
