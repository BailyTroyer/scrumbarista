import { v4 as uuidv4 } from 'uuid';

export const handleError = (token: string, channelId: string, userId: string, slackHandler: any, error: any) => {
	const errorId = uuidv4();
  console.log(`Unhandled InfraPermissionsError: ${errorId} | ${error} | ${error.stack}`);
  slackHandler.postEphemeral(token, channelId, userId, [], `InfraPermissions Error ${errorId}`);
};
