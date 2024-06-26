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
        title: Yup.string().required(),
        description: Yup.string().optional(),
        url: Yup.string().optional(),
      });
      await validator.validate(req.body);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: {
            message: "You are not allowed to create an announcement.",
          },
        });
      }

      const { description, title, url } = validator.cast(req.body);

      const announcement = await prisma.announcement.create({
        data: {
          description,
          title,
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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[title]": Yup.string().optional(),
        "filter[description]": Yup.string().optional(),
        "filter[url]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[title]": filterTitle,
        "filter[description]": filterDescription,
        "filter[url]": filterUrl,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);

      const announcements = await prisma.announcement.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              title: {
                contains: filterTitle,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: filterDescription,
                mode: "insensitive",
              },
            },
            {
              url: {
                contains: filterUrl,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          [sortField || "updatedAt"]: sortDirection || "desc",
        },
      });
      const count = await prisma.announcement.count({
        where: {
          AND: [
            {
              title: {
                contains: filterTitle,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: filterDescription,
                mode: "insensitive",
              },
            },
            {
              url: {
                contains: filterUrl,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return res.json({ announcements, count });
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
