import { rest } from "msw";

import { server } from "../../mocks/server";
import {
  checkinCommand,
  scrumbaristaCommand,
  standupCommand,
} from "../commands";

describe("The commands handlers", () => {
  describe("scrumbaristaCommand", () => {
    it("posts an ephemeral message", async () => {
      const postEphemeral = jest.fn();

      await scrumbaristaCommand({
        ack: jest.fn(),
        command: {
          channel_id: "channel",
          user_id: "user",
        },
        client: {
          chat: {
            postEphemeral,
          },
        },
        body: {
          text: "",
        },
      } as any);

      expect(postEphemeral.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe("standupCommand", () => {
    it("creates a standup when one doesn't exist for channel", async () => {
      const open = jest.fn();

      server.use(
        rest.get("http://localhost:8000/standups/channel", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: ["questions"],
              days: ["monday"],
              startTime: "09:00:00",
            })
          )
        )
      );

      await standupCommand({
        ack: jest.fn(),
        command: {
          channel_id: "channel",
          trigger_id: "trigger",
        },
        client: {
          views: {
            open,
          },
        },
        body: {
          text: "",
        },
      } as any);

      expect(open.mock.calls[0]).toMatchSnapshot();
    });
    it("uses a pre-existing standup to create modal", async () => {
      const open = jest.fn();

      server.use(
        rest.post("http://localhost:8000/standups", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: ["questions"],
              days: ["monday"],
            })
          )
        )
      );

      await standupCommand({
        ack: jest.fn(),
        command: {
          channel_id: "channel",
          trigger_id: "trigger",
        },
        client: {
          views: {
            open,
          },
        },
        body: {
          text: "",
        },
      } as any);

      expect(open.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe("checkinCommand", () => {
    it("opens the checkin model", async () => {
      const open = jest.fn();
      const postEphemeral = jest.fn();

      server.use(
        rest.get("http://localhost:8000/standups/channel", (req, res, ctx) =>
          res(
            ctx.json({
              id: "id",
              name: "name",
              channelId: "C01LQPT2LMD",
              questions: ["questions"],
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
                answers: ["answers"],
                postMessageTs: "messageTs",
              })
            )
        )
      );

      await checkinCommand({
        ack: jest.fn(),
        command: {
          user_id: "user",
          channel_id: "channel",
          trigger_id: "trigger",
        },
        client: {
          views: {
            open,
            postEphemeral,
          },
        },
      } as any);

      expect(open.mock.calls[0]).toMatchSnapshot();
      expect(postEphemeral).not.toBeCalled();
    });

    it("posts an ephemeral message when no standup exists", async () => {
      const open = jest.fn();
      const postEphemeral = jest.fn();

      server.use(
        rest.get("http://localhost:8000/standups/channel", (req, res, ctx) =>
          res(ctx.status(400))
        ),
        rest.get(
          "http://localhost:8000/standups/channel/checkins",
          (req, res, ctx) => res(ctx.status(400))
        )
      );

      await checkinCommand({
        ack: jest.fn(),
        command: {
          user_id: "user",
          channel_id: "channel",
          trigger_id: "trigger",
        },
        client: {
          views: {
            open,
          },
          chat: {
            postEphemeral,
          },
        },
      } as any);

      expect(open).not.toBeCalled();
      expect(postEphemeral.mock.calls[0]).toMatchSnapshot();
    });
  });
});
