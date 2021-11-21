import { App, ExpressReceiver } from '@slack/bolt';

declare let process: {
  env: {
    SLACK_BOT_TOKEN: string;
    SLACK_SIGNING_SECRET: string;
    PORT: number;
  };
};

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT;

const receiver = new ExpressReceiver({
  signingSecret,
  endpoints: '/slack/events',
});

receiver.app.get('/health', (_, res) => {
  res.send('healthy');
});

const app = new App({ token, receiver });

app.command('/scrumbarista', async ({ ack, say }) => {
  await ack();
  await say('/scrumbarista');
});

(async () => {
  await app.start(port);
})();
