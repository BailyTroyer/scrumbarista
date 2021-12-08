import { rest } from "msw";
import { server } from "../../mocks/server";
import { checkinCommand, scrumbaristaCommand, standupCommand } from "../commands";

describe("The commands handlers", () => {
  describe("scrumbaristaCommand", () => {
    it("posts an ephemeral message", async () => {
      const postEphemeral = jest.fn()
  
      await scrumbaristaCommand({
        ack: jest.fn(),
        command: {
          channel_id: 'channel',
          user_id: 'user'
        },
        client: {
          chat: {
            postEphemeral
          },
        },
      } as any)
  
      expect(postEphemeral.mock.calls[0]).toMatchSnapshot()
    })
  })
  describe("standupCommand", () => {
    it("opens a view with the proper standup information", async () => {
      const open = jest.fn()

      server.use(
        rest.get('http://localhost:8000/standups?channelId=channel', (req, res, ctx) => (
          res(ctx.json({
            id: 'id',
            name: 'name',
            channelId: 'C01LQPT2LMD',
            questions: 'questions',
            days: ['monday']
          }))
        )),
      )
  
      await standupCommand({
        ack: jest.fn(),
        command: {
          channel_id: 'channel',
          trigger_id: 'trigger'
        },
        client: {
          views: {
            open
          },
        },
      } as any)
  
      expect(open.mock.calls[0]).toMatchSnapshot()
    })
  })
  describe("checkinCommand", () => {
    it("opens the checkin model", async () => {
      const open = jest.fn()
      const postEphemeral = jest.fn()

      server.use(
        rest.get('http://localhost:8000/standups?channelId=channel', (req, res, ctx) => (
          res(ctx.json({
            id: 'id',
            name: 'name',
            channelId: 'C01LQPT2LMD',
            questions: 'questions',
            days: ['monday']
          }))
        )),
        rest.get('http://localhost:8000/standups/channel/checkins', (req, res, ctx) => (
          res(ctx.json({
            createdDate: new Date(),
            answers: 'answers',
            postMessageTs: 'messageTs',
          }))
        ))
      )
    
      await checkinCommand({
        ack: jest.fn(),
        command: {
          user_id: 'user',
          channel_id: 'channel',
          trigger_id: 'trigger'
        },
        client: {
          views: {
            open,
            postEphemeral
          },
        },
      } as any)
  
      expect(open.mock.calls[0]).toMatchSnapshot()
      expect(postEphemeral).not.toBeCalled()
    })
    it("posts an ephemeral message when no standup exists", async () => {
      const open = jest.fn()
      const postEphemeral = jest.fn()

      await checkinCommand({
        ack: jest.fn(),
        command: {
          user_id: 'user',
          channel_id: 'channel',
          trigger_id: 'trigger'
        },
        client: {
          views: {
            open
          },
          chat: {
            postEphemeral,
          }
        },
      } as any)
  
      expect(open).not.toBeCalled()
      expect(postEphemeral.mock.calls[0]).toMatchSnapshot()
    })
  })
})