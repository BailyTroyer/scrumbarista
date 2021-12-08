import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

export const dmMessage: Middleware<SlackEventMiddlewareArgs<'message'>> = async ({ message, say }) => {
  await say(`Hello`);
}