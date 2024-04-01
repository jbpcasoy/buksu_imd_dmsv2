import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;
  try {
    user = await getServerUser(req, res);
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const id = req.query.id as string;

      const syllabusFile = await prisma.syllabusFile.findFirstOrThrow({
        where: {
          id: {
            equals: id,
          },
        },
      });

      return res.status(200).json(syllabusFile);
    } catch (error: any) {
      logger.error(error);
      return res.status(400).json({
        error: {
          message: error?.message ?? "Server Error",
        },
      });
    }
  };

  const deleteHandler = async () => {
    try {
      const id = req.query.id as string;

      const syllabusFile = await prisma.syllabusFile.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json(syllabusFile);
    } catch (error: any) {
      logger.error(error);
      return res.status(400).json({
        error: {
          message: error?.message ?? "Server Error",
        },
      });
    }
  };

  switch (req.method) {
    case "GET":
      return getHandler();
    case "DELETE":
      return deleteHandler();
    default:
      return res.status(405).send(`${req.method} Not allowed`);
  }
}
