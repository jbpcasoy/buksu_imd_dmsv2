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
        cITLRevisionId: Yup.string().required(),
        activeIDDCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { cITLRevisionId, activeIDDCoordinatorId } = validator.cast(
        req.body
      );

      if (!user.isAdmin) {
        const iDDCoordinator = await prisma.iDDCoordinator.findFirst({
          where: {
            ActiveIDDCoordinator: {
              IDDCoordinator: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });

        if (!iDDCoordinator) {
          return res.status(403).json({
            error: {
              message:
                "Only an active IDD coordinator is allowed to perform this action",
            },
          });
        }

        const submittedReturnedCITLRevision =
          await prisma.submittedReturnedCITLRevision.findFirst({
            where: {
              ReturnedCITLRevision: {
                CITLRevision: {
                  id: {
                    equals: cITLRevisionId,
                  },
                },
              },
            },
          });
        if (submittedReturnedCITLRevision) {
          return res.status(400).json({
            error: {
              message: "Error: This CITL revision is returned",
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

      const iDDCoordinatorEndorsement =
        await prisma.iDDCoordinatorEndorsement.create({
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
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "IDD_COORDINATOR_ENDORSEMENT_CREATED",
              },
            },
          },
        });

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
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDCoordinatorEndorsement.count({
        where: {},
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
