import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:8000/healthy", (req, res, ctx) => {
    return res(ctx.status(200), ctx.text("healthy"));
  }),

  // rest.get("http://localhost:8000/standups", (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json({
  //     id: 'id',
  //     name: 'name',
  //     channelId: 'C01LQPT2LMD',
  //     questions: 'questions',
  //     days: ['monday']
  //   }));
  // }),

  // rest.post('https://slack.com/api/views.open', (req, res, ctx) => {
  //   return res(ctx.status(200))
  // })
];
