import prisma from "@/prisma/client";
import iMERCIDDCoordinatorEndorsementAbility from "@/services/ability/iMERCIDDCoordinatorEndorsementAbility";
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
  const ability = iMERCIDDCoordinatorEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMERCCITLRevisionId: Yup.string().required(),
        activeIDDCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IMERCIDDCoordinatorEndorsement"
      );

      const { iMERCCITLRevisionId, activeIDDCoordinatorId } = validator.cast(
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

      const iMERCIDDCoordinatorEndorsement =
        await prisma.iMERCIDDCoordinatorEndorsement.create({
          data: {
            IDDCoordinator: {
              connect: {
                id: iDDCoordinator.id,
              },
            },
            IMERCCITLRevision: {
              connect: {
                id: iMERCCITLRevisionId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED",
              },
            },
          },
        });

      return res.json(iMERCIDDCoordinatorEndorsement);
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
      const iMERCIDDCoordinatorEndorsements =
        await prisma.iMERCIDDCoordinatorEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).IMERCIDDCoordinatorEndorsement],
          },
        orderBy: {
          updatedAt: "desc",
        },
        });
      const count = await prisma.iMERCIDDCoordinatorEndorsement.count({
        where: {
          AND: [accessibleBy(ability).IMERCIDDCoordinatorEndorsement],
        },
      });

      return res.json({ iMERCIDDCoordinatorEndorsements, count });
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
