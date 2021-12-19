import { rest } from "msw";

import { server } from "../../mocks/server";
import { dmMessage } from "../messages";

describe("The messages handlers", () => {
  describe("dm catch all", () => {
    it("does nothing when channel type isn't im", async () => {
      const say = jest.fn();
      const postMessage = jest.fn();
      const info = jest.fn();

      await dmMessage({
        say,
        message: {
          channel_type: "other",
        },
        client: {
          users: {
            info,
          },
          chat: {
            postMessage,
          },
        },
      } as any);

      expect(say).not.toBeCalled();
      expect(postMessage).not.toBeCalled();
      expect(info).not.toBeCalled();
    });
    it("posts reply when no checkin exists", async () => {
      const say = jest.fn();

      await dmMessage({
        say,
        message: {
          channel_type: "im",
          channel: "channel",
          text: "hello, world!",
          user: "userId",
          ts: "messageTs",
        },
      } as any);

      expect(say.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "I'm not sure what checkin this is for?",
        ]
      `);
    });
    it("posts default message when already completed checkin for the day", async () => {
      const say = jest.fn();

      server.use(
        rest.get("http://localhost:8000/standups/channel", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: "questions",
              days: ["monday"],
            })
          )
        ),
        rest.get(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) =>
            res(
              ctx.json({
                createdDate: new Date(),
                answers: "answers",
                postMessageTs: "messageTs",
              })
            )
        )
      );

      await dmMessage({
        say,
        message: {
          channel_type: "im",
          channel: "channel",
          text: "hello, world!",
          user: "userId",
          ts: "messageTs",
        },
      } as any);

      expect(say.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "Did you know, that you can share feedback with us and at the same time see what we're working on? @todo change this message",
        ]
      `);
    });
    it("asks next question in current day's standup", async () => {
      const say = jest.fn();

      server.use(
        rest.get("http://localhost:8000/standups/channel", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: "question1\nquestion2\nquestion3",
              days: ["monday"],
            })
          )
        ),
        rest.get(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) =>
            res(
              ctx.json({
                createdDate: new Date(),
                answers: "",
                postMessageTs: "messageTs",
              })
            )
        )
      );

      await dmMessage({
        say,
        message: {
          channel_type: "im",
          channel: "channel",
          text: "hello, world!",
          user: "userId",
          ts: "messageTs",
        },
      } as any);

      expect(say.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "question1",
        ]
      `);
    });
    it("says all done when submitted last answer to day's standup", async () => {
      const say = jest.fn();
      const info = jest.fn().mockReturnValue({
        user: {
          profile: {
            real_name: "name",
            image_192: "image",
          },
        },
      });
      const postMessage = jest.fn();

      server.use(
        rest.get("http://localhost:8000/standups/channel", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: "question1\nquestion2\nquestion3",
              days: ["monday"],
            })
          )
        ),
        rest.get(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) =>
            res(
              ctx.json({
                createdDate: new Date(),
                answers: "answer1\nanswer2",
                postMessageTs: "messageTs",
              })
            )
        )
      );

      await dmMessage({
        say,
        message: {
          channel_type: "im",
          channel: "channel",
          text: "hello, world!",
          user: "userId",
          ts: "messageTs",
        },
        client: {
          users: {
            info,
          },
          chat: {
            postMessage,
          },
        },
      } as any);

      expect(say.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "all done. Thanks!",
        ]
      `);
      expect(info.mock.calls[0]).toMatchSnapshot();
      expect(postMessage.mock.calls[0]).toMatchSnapshot();
    });
  });
});
