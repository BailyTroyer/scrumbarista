import {receiver, signingSecret, app} from '../app'

import request from 'supertest';

import * as slashCommands from '../slack/commands'

import crypto from 'crypto';

jest.spyOn(app.client.auth, 'test').mockImplementation();

const generateSignature = (body: Object, timestamp: number, signingSecret: string): string => {
  const bodyString = JSON.stringify(body);
  const signatureString = `v0:${timestamp}:${bodyString}`;
  const hash = crypto.createHmac('sha256', signingSecret).update(signatureString, 'utf8').digest('hex');
  return `v0=${hash}`;
}

describe("The Scrumbarista BoltJS App", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.stop()
  })

  describe("express reciever", () => {
    it("returns a 200 on /healthcheck", async () => {
      return request(receiver.app)
        .get('/health')
        .expect(200)
        .expect("healthy");
    })
  })

  describe("/scrumbarista slash command", () => {
    it("returns the valid attachments", async () => {
      const mockShortcutPayload = { command: '/scrumbarista' };
  
      const timestamp = new Date().valueOf();
      const signature = generateSignature(JSON.stringify(mockShortcutPayload), timestamp, signingSecret)
  

      const actual = jest.requireActual("../slack/commands");
      const spy = jest.spyOn(actual, "scrumbaristaCommand");
      // const mockScrumbaristaCommand = jest.spyOn(slashCommands, 'scrumbaristaCommand').mockImplementation()
  
      await request(receiver.app)
        .post('/slack/events')
        .send(mockShortcutPayload)
        .set({
          'x-slack-signature': signature,
          'x-slack-request-timestamp': timestamp,
        })
        .expect(200)
  
      expect(spy).toBeCalled()
    })
  })

  // describe ("/standup slash command", () => {
  //   it("opens the right view", async () => {
  //     const mockShortcutPayload = {
  //       command: '/standup',
  //       channel_id: "id",
  //       callback_id: 'standup',
  //       trigger_id: '1234',
  //     };

  //     const open = jest.spyOn(app.client.views, 'open').mockImplementation()
  
  //     const timestamp = new Date().valueOf();
  //     const signature = generateSignature(JSON.stringify(mockShortcutPayload), timestamp, signingSecret)
  
  //     await request(receiver.app)
  //       .post('/slack/events')
  //       .send(mockShortcutPayload)
  //       .set({
  //         'x-slack-signature': signature,
  //         'x-slack-request-timestamp': timestamp,
  //       })
  //       .expect(200)
  
  //     expect(open).toBeCalled()
  //   })
  // })
});
