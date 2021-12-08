import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  res.status(200).send("healthy");
};

export default handler;
