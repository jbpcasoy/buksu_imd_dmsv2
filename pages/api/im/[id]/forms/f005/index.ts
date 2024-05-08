import getServerUser from "@/services/getServerUser";
import { readIMF005 } from "@/services/iMService";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;

  try {
    user = await getServerUser(req, res);
  } catch (error) {
    logger.error(error);
    return res.status(501).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    const id = req.query.id as string;

    try {
      const response = await readIMF005({ id });

      return res.json(response);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(500)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(505).send(`${req.method} Not Allowed`);
  }
}
