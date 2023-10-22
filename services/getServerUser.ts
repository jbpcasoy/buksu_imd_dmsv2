import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import logger from "./logger";
import { parse } from "url";

export default async function getServerUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User> {
  const session = await getServerSession(req, res, authOptions);
  logger.info({
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    userId: session?.user?.id,
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}
