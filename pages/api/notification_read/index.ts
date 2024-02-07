import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        eventId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { eventId } = validator.cast(req.body);

      const notificationRead = await prisma.notificationRead.create({
        data: {
          Event: {
            connect: {
              id: eventId,
            },
          },
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return res.json(notificationRead);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const notificationReads = await prisma.notificationRead.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.notificationRead.count({
        where: {},
      });

      return res.json({ notificationReads, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "POST":
      return await postHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
