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
        iMERCCITLRevisionId: Yup.string().required(),
        activeIDDCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { iMERCCITLRevisionId, activeIDDCoordinatorId } = validator.cast(
        req.body
      );
      if (!user.isAdmin) {
        const iDDCoordinator = await prisma.iDDCoordinator.findFirst({
          where: {
            ActiveIDDCoordinator: {
              id: {
                equals: activeIDDCoordinatorId,
              },
            },
          },
        });
        if (!iDDCoordinator) {
          return res.status(403).json({
            error: {
              message: "Only an active IDD coordinator can perform this action",
            },
          });
        }

        if (iDDCoordinator.userId !== user.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this IMERC IDD coordinator endorsement",
            },
          });
        }

        const submittedReturnedIMERCCITLRevision =
          await prisma.submittedReturnedIMERCCITLRevision.findFirst({
            where: {
              ReturnedIMERCCITLRevision: {
                IMERCCITLRevision: {
                  id: {
                    equals: iMERCCITLRevisionId,
                  },
                },
              },
            },
          });
        if (submittedReturnedIMERCCITLRevision) {
          return res.status(403).json({
            error: {
              message: "Error: IMERC CITL revision is returned",
            },
          });
        }
      }

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
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iMERCIDDCoordinatorEndorsement.count({
        where: {},
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
