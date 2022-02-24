import {
  Middleware,
  SlackActionMiddlewareArgs,
  SlackAction,
  StaticSelectAction,
} from "@slack/bolt";

import { getStandup, searchForCheckin } from "../services/api";
import { onOutOfOffice, onSkip } from "../services/standup";

export const checkinMessageQuickResponseAction: Middleware<
  SlackActionMiddlewareArgs<SlackAction>
> = async ({
  ack,
  action,
  body: {
    user: { id: user },
  },
  client,
  say,
}) => {
  await ack();

  // Either `ooo` or `prev` or `skip`
  const {
    selected_option: { value },
    action_ts: ts,
  } = action as StaticSelectAction;

  // check for checkin with user ID
  const date = new Date().toLocaleDateString();

  const preExistingCheckin = await searchForCheckin(user, date);
  const standup = await getStandup(preExistingCheckin?.channelId);

  // cronjob creates partial checkin which we complete here
  if (!preExistingCheckin) {
    say("I'm not sure what checkin this is for?");
    return;
  }

  switch (value) {
    case "ooo":
      return onOutOfOffice(client, say, user, standup, preExistingCheckin);
    case "skip":
      return onSkip(client, say, user, standup, preExistingCheckin, ts);
  }
};
