// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/prisma/client";
import userAbility from "@/services/ability/userAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { accessibleBy } from "@casl/prisma";
import { PrismaClient, User } from "@prisma/client";
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
  const ability = userAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        skip: Yup.number().required(),
        take: Yup.number().required(),
        "filter[email]": Yup.string().optional(),
        "filter[name]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().oneOf(["asc", "desc"]).optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[email]": filterEmail,
        "filter[name]": filterName,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);

      const users = await prisma.user.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).User,
            {
              AND: [
                {
                  email: {
                    contains: filterEmail,
                    mode: "insensitive",
                  },
                },
                {
                  name: {
                    contains: filterName,
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
        orderBy: {
          [sortField || "name"]: sortDirection || "asc",
        },
      });
      const count = await prisma.user.count({
        where: {
          AND: [
            accessibleBy(ability).User,
            {
              AND: [
                {
                  email: {
                    contains: filterEmail,
                  },
                },
                {
                  name: {
                    contains: filterName,
                  },
                },
              ],
            },
          ],
        },
      });

      return res.json({ users, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
