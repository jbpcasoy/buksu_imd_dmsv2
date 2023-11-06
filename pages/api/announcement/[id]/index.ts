import prisma from "@/prisma/client";
import announcementAbility from "@/services/ability/announcementAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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
  const ability = announcementAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const announcement = await prisma.announcement.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).Announcement,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(announcement);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan("delete", "Announcement");

      const { id } = validator.cast(req.query);

      const announcement = await prisma.announcement.delete({
        where: {
          id,
        },
      });

      return res.json(announcement);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        title: Yup.string().required(),
        description: Yup.string().required(),
        url: Yup.string().required(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("update", "Announcement");

      const { id } = req.query;
      const { title, description, url } = validator.cast(req.body);

      const announcement = await prisma.announcement.update({
        where: {
          id: id as string,
        },
        data: {
          title,
          description,
          url,
        },
      });

      return res.json(announcement);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
