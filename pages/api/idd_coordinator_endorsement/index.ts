import prisma from "@/prisma/client";
import iDDCoordinatorEndorsementAbility from "@/services/ability/iDDCoordinatorEndorsementAbility";
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
  const ability = iDDCoordinatorEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        cITLRevisionId: Yup.string().required(),
        activeIDDCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IDDCoordinatorEndorsement"
      );

      const { cITLRevisionId, activeIDDCoordinatorId } = validator.cast(
        req.body
      );

      const iDDCoordinator = await prisma.iDDCoordinator.findFirstOrThrow({
        where: {
          ActiveIDDCoordinator: {
            id: {
              equals: activeIDDCoordinatorId,
            },
          },
        },
      });

      const iDDCoordinatorEndorsement = await prisma.iDDCoordinatorEndorsement.create(
        {
          data: {
            IDDCoordinator: {
              connect: {
                id: iDDCoordinator.id,
              },
            },
            CITLRevision: {
              connect: {
                id: cITLRevisionId,
              },
            },
          },
        }
      );

      return res.json(iDDCoordinatorEndorsement);
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
      const iDDCoordinatorEndorsements =
        await prisma.iDDCoordinatorEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).IDDCoordinatorEndorsement],
          },
        });
      const count = await prisma.iDDCoordinatorEndorsement.count({
        where: {
          AND: [accessibleBy(ability).IDDCoordinatorEndorsement],
        },
      });

      return res.json({ iDDCoordinatorEndorsements, count });
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
