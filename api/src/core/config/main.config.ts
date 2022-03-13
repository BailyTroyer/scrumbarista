type AppConfig = {
  nodeEnv: string;
  port: number;
  slack: {
    botToken: string;
    signingSecret: string;
  };
};

export default (): AppConfig => {
  process.env;
  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 3000,
    slack: {
      botToken: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
    },
  };
};
