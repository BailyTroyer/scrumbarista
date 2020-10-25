import { App } from '@slack/bolt';

export default class SlackHandler {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	printError(error: any) {
		console.log(error);
	}

	async openModal(token: string, view: any, trigger_id: string) {
		return await this.app.client.views.open({ token, trigger_id, view });
	}

	async pushView(token: string, view: any, trigger_id: string) {
		return await this.app.client.views.push({ token, trigger_id, view });
	}

	async postEphemeral(token: string, channel: string, user: string, attachments: any, text: string) {
		return await this.app.client.chat.postEphemeral({ token, channel, text, user, attachments });
	}

	async deleteMessage(token: string, channel: string, ts: string) {
		return await this.app.client.chat.delete({ token, channel, ts });
	}

	async postMessageText(token: string, channel: string, text: string, thread_ts: string) {
		return await this.app.client.chat.postMessage({ token, channel, text, thread_ts });
	}

	async uploadFile(token: string, thread_ts: string, channels: any, initial_comment: string, file: any) {
		return await this.app.client.files.upload({ token, thread_ts, channels, initial_comment, file });
	}

	async postMessageAttachments(token: string, channel: string, attachments: any, text: string = '') {
		return await this.app.client.chat.postMessage({ token, channel, attachments, text });
  }

  async postMessageAttachmentsCustom(token: string, channel: string, attachments: any, username: string, icon_url: string) {
		return await this.app.client.chat.postMessage({ token, channel, attachments, text: '', username, icon_url });
	}

	async postMessageBlocks(token: string, channel: string, blocks: any, text: string = ''): Promise<any> {
		const response: any = await this.app.client.chat.postMessage({ token, channel, blocks, text });
		return {
			channel: response.channel,
			ts: response.ts
		};
	}

	async updateMessage(
		token: string,
		channel: string,
		attachments: any = [],
		blocks: any = [],
		ts: string,
		text: string = ''
	) {
		return await this.app.client.chat.update({ token, channel, text, attachments, blocks, ts });
	}

	async getUser(user: string, token: string) {
		return await this.app.client.users.info({ token, user, include_locale: true });
	}
}
