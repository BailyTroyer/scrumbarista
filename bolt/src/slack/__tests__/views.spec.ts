import { rest } from "msw";

import { server } from "../../mocks/server";
import { checkinView, standupView } from "../views";

describe("The views handlers", () => {
  describe("standupView", () => {
    it("posts an ephemeral message when standup is successfully configured", async () => {
      const postEphemeral = jest.fn();

      server.use(
        rest.post("http://localhost:8000/standups", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: "questions",
              days: ["monday"],
            })
          )
        )
      );

      await standupView({
        ack: jest.fn(),
        command: {
          user_id: "user",
          channel_id: "channel",
          trigger_id: "trigger",
        },
        body: {
          user: { id: "userId" },
        },
        view: {
          state: {
            values: {
              name: { name: { value: "name" } },
              questions: { questions: { value: "questions" } },
              days: { days: { selected_options: [{ value: "day" }] } },
            },
          },
          private_metadata: JSON.stringify({ channelId: "" }),
        },
        client: {
          chat: {
            postEphemeral,
          },
        },
      } as any);

      expect(postEphemeral.mock.calls[0]).toMatchSnapshot();
    });

    it("posts an emphemeral message when unable to update standup", async () => {
      const postEphemeral = jest.fn();

      server.use(
        rest.post("http://localhost:8000/standups", (req, res, ctx) =>
          res(ctx.status(400))
        )
      );

      await standupView({
        ack: jest.fn(),
        command: {
          user_id: "user",
          channel_id: "channel",
          trigger_id: "trigger",
        },
        body: {
          user: { id: "userId" },
        },
        view: {
          state: {
            values: {
              name: { name: { value: "name" } },
              questions: { questions: { value: "questions" } },
              days: { days: { selected_options: [{ value: "day" }] } },
            },
          },
          private_metadata: JSON.stringify({ channelId: "" }),
        },
        client: {
          chat: {
            postEphemeral,
          },
        },
      } as any);

      expect(postEphemeral.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe("checkinView", () => {
    it("creates new checkin and posts message in standup channel", async () => {
      const postMessage = jest.fn().mockReturnValue({
        ts: "messageTs",
      });
      const info = jest.fn().mockReturnValue({
        user: {
          id: "userId",
          profile: {
            real_name: "name",
            image_192: "image",
          },
        },
      });

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
        rest.post(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) =>
            res(
              ctx.json({
                createdDate: new Date(),
                answers: "answers",
                postMessageTs: "messageTs",
              })
            )
        ),
        rest.get(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) => res(ctx.status(400))
        )
      );

      await checkinView({
        ack: jest.fn(),
        command: {
          user_id: "user",
          channel_id: "channel",
          trigger_id: "trigger",
        },
        body: {
          user: { id: "userId" },
        },
        view: {
          state: {
            values: {
              name: { name: { value: "name" } },
              questions: { questions: { value: "questions" } },
              days: { days: { selected_options: [{ value: "day" }] } },
            },
          },
          private_metadata: JSON.stringify({ channelId: "channel" }),
        },
        client: {
          chat: {
            postMessage,
          },
          users: {
            info,
          },
        },
      } as any);

      expect(info.mock.calls[0]).toMatchSnapshot();
      expect(postMessage.mock.calls[0]).toMatchSnapshot();
    });

    it("updates pre-existing checkin and posts message in standup channel", async () => {
      const update = jest.fn().mockReturnValue({
        ts: "messageTs",
      });
      const info = jest.fn().mockReturnValue({
        user: {
          id: "userId",
          profile: {
            real_name: "name",
            image_192: "image",
          },
        },
      });

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
        rest.patch(
          "http://localhost:8000/standups/channel/checkins/id",
          (req, res, ctx) =>
            res(
              ctx.json({
                createdDate: new Date(),
                answers: "answers",
                postMessageTs: "messageTs",
              })
            )
        ),
        rest.get(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) =>
            res(
              ctx.json([
                {
                  id: "id",
                  createdDate: new Date(),
                  answers: "answers",
                  postMessageTs: "messageTs",
                },
              ])
            )
        )
      );

      await checkinView({
        ack: jest.fn(),
        command: {
          user_id: "user",
          channel_id: "channel",
          trigger_id: "trigger",
        },
        body: {
          user: { id: "userId" },
        },
        view: {
          state: {
            values: {
              name: { name: { value: "name" } },
              questions: { questions: { value: "questions" } },
              days: { days: { selected_options: [{ value: "day" }] } },
            },
          },
          private_metadata: JSON.stringify({ channelId: "channel" }),
        },
        client: {
          chat: {
            update,
          },
          users: {
            info,
          },
        },
      } as any);

      expect(info.mock.calls[0]).toMatchSnapshot();
      expect(update.mock.calls[0]).toMatchSnapshot();
    });
  });
});
