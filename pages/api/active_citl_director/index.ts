import prisma from "@/prisma/client";
import activeCITLDirectorAbility from "@/services/ability/activeCITLDirectorAbility";
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

  let ability = activeCITLDirectorAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        cITLDirectorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ActiveCITLDirector"
      );

      const { cITLDirectorId } = validator.cast(req.body);

      const cITLDirector = await prisma.cITLDirector.findFirstOrThrow({
        where: {
          id: {
            equals: cITLDirectorId,
          },
        },
      });

      const userActiveCITLDirectorCount =
        await prisma.activeCITLDirector.count();

      if (userActiveCITLDirectorCount > 0) {
        return res.status(409).json({
          error: { message: "There can only be one active CITL director" },
        });
      }

      const activeCITLDirector = await prisma.activeCITLDirector.create({
        data: {
          CITLDirector: {
            connect: {
              id: cITLDirector.id,
            },
          },
        },
      });

      return res.json(activeCITLDirector);
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

      const activeCITLDirectors = await prisma.activeCITLDirector.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveCITLDirector,
            {
              CITLDirector: {
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
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.activeCITLDirector.count({
        where: {
          AND: [accessibleBy(ability).ActiveCITLDirector],
        },
      });

      return res.json({ activeCITLDirectors, count });
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
