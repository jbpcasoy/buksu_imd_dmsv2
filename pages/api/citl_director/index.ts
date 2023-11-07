import prisma from "@/prisma/client";
import cITLDirectorAbility from "@/services/ability/cITLDirectorAbility";
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

  let ability = cITLDirectorAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        userId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "CITLDirector");

      const { userId } = validator.cast(req.body);

      const cITLDirector = await prisma.cITLDirector.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return res.json(cITLDirector);
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
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);
      const cITLDirectors = await prisma.cITLDirector.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).CITLDirector,
            {
              User: {
                name: {
                  contains: filterName,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.cITLDirector.count({
        where: {
          AND: [accessibleBy(ability).CITLDirector],
        },
      });

      return res.json({ cITLDirectors, count });
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
