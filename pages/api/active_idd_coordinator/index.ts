import prisma from "@/prisma/client";
import activeIDDCoordinatorAbility from "@/services/ability/activeIDDCoordinatorAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";

import { ForbiddenError } from "@casl/ability";
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

  let ability = activeIDDCoordinatorAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "ActiveIDDCoordinator");

      const { iDDCoordinatorId } = validator.cast(req.body);

      const iDDCoordinator = await prisma.iDDCoordinator.findFirstOrThrow({
        where: {
          id: {
            equals: iDDCoordinatorId,
          },
        },
      });

      const userActiveIDDCoordinatorCount = await prisma.activeIDDCoordinator.count();

      if (userActiveIDDCoordinatorCount > 0) {
        return res.status(409).json({
          error: { message: "There can only be one active IDD Coordinator" },
        });
      }

      const activeIDDCoordinator = await prisma.activeIDDCoordinator.create({
        data: {
          IDDCoordinator: {
            connect: {
              id: iDDCoordinator.id,
            },
          },
        },
      });

      return res.json(activeIDDCoordinator);
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

      const activeIDDCoordinators = await prisma.activeIDDCoordinator.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveIDDCoordinator,
            {
              IDDCoordinator: {
                User: {
                  name: {
                    contains: filterName,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
      });
      const count = await prisma.activeIDDCoordinator.count({
        where: {
          AND: [accessibleBy(ability).ActiveIDDCoordinator],
        },
      });

      return res.json({ activeIDDCoordinators, count });
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
