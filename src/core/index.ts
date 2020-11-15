import { v4 as uuidv4 } from "uuid";

export const handleError = (
  token: string,
  channelId: string,
  userId: string,
  slackHandler: any,
  error: any
) => {
  const errorId = uuidv4();
  console.log(`unhandled error: ${errorId} | ${error} | ${error.stack}`);
  slackHandler.postEphemeral(token, channelId, userId, [], `error ${errorId}`);
};
