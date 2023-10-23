import prisma from "@/prisma/client";
import iMERCCITLDirectorEndorsementAbility from "@/services/ability/iMERCCITLDirectorEndorsementAbility";
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
  const ability = iMERCCITLDirectorEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMERCIDDCoordinatorEndorsementId: Yup.string().required(),
        activeCITLDirectorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IMERCCITLDirectorEndorsement"
      );

      const { iMERCIDDCoordinatorEndorsementId, activeCITLDirectorId } =
        validator.cast(req.body);

      const cITLDirector = await prisma.cITLDirector.findFirstOrThrow({
        where: {
          ActiveCITLDirector: {
            id: {
              equals: activeCITLDirectorId,
            },
          },
        },
      });

      const iMERCCITLDirectorEndorsement =
        await prisma.iMERCCITLDirectorEndorsement.create({
          data: {
            CITLDirector: {
              connect: {
                id: cITLDirector.id,
              },
            },
            IMERCIDDCoordinatorEndorsement: {
              connect: {
                id: iMERCIDDCoordinatorEndorsementId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "IMERC_CITL_DIRECTOR_ENDORSEMENT_CREATED",
              },
            },
          },
        });

      return res.json(iMERCCITLDirectorEndorsement);
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
      const iMERCCITLDirectorEndorsements =
        await prisma.iMERCCITLDirectorEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).IMERCCITLDirectorEndorsement],
          },
        });
      const count = await prisma.iMERCCITLDirectorEndorsement.count({
        where: {
          AND: [accessibleBy(ability).IMERCCITLDirectorEndorsement],
        },
      });

      return res.json({ iMERCCITLDirectorEndorsements, count });
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
