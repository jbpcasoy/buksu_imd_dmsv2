import prisma from "@/prisma/client";
import iDDCoordinatorAbility from "@/services/ability/iDDCoordinatorAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Prisma, User } from "@prisma/client";
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

  let ability = iDDCoordinatorAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        userId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "IDDCoordinator");

      const { userId } = validator.cast(req.body);

      const existingIDDCoordinator = await prisma.iDDCoordinator.findFirst({
        where: {
          User: {
            id: {
              equals: userId,
            },
          },
        },
      });
      if (existingIDDCoordinator) {
        throw new Error("IDD coordinator already exists");
      }
      const iDDCoordinator = await prisma.iDDCoordinator.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return res.json(iDDCoordinator);
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
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);
      const iDDCoordinators = await prisma.iDDCoordinator.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).IDDCoordinator,
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
        orderBy:
          sortField === "name"
            ? ({
                User: {
                  name: sortDirection ?? "asc",
                },
              } as Prisma.IDDCoordinatorOrderByWithRelationInput)
            : ({
                User: {
                  name: sortDirection ?? "asc",
                },
              } as Prisma.IDDCoordinatorOrderByWithRelationInput),
      });
      const count = await prisma.iDDCoordinator.count({
        where: {
          AND: [accessibleBy(ability).IDDCoordinator],
        },
      });

      return res.json({ iDDCoordinators, count });
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
