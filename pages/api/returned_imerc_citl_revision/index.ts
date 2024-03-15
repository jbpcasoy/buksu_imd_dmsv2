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

      const { activeIDDCoordinatorId, iMERCCITLRevisionId } = validator.cast(
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
      if (!iDDCoordinator) {
        return res.status(403).json({
          error: {
            message: "Only an active IDD coordinator can perform this action",
          },
        });
      }

      if (!user.isAdmin) {
        if (iDDCoordinator.userId !== user.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create an IDD specialist review for this user",
            },
          });
        }
      }

      const iMERCIDDCoordinatorEndorsement =
        await prisma.iMERCIDDCoordinatorEndorsement.findFirst({
          where: {
            IMERCCITLRevision: {
              AND: [
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          IMERCCITLRevision: {
                            id: {
                              equals: iMERCCITLRevisionId,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          IMERCCITLRevision: {
                            IMERCIDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        });

      if (iMERCIDDCoordinatorEndorsement) {
        throw new Error("IM is already endorsed by the IDD coordinator");
      }

      const activeIDDCoordinator =
        await prisma.activeIDDCoordinator.findFirstOrThrow({
          where: {
            id: {
              equals: activeIDDCoordinatorId,
            },
          },
        });

      const returnedIMERCCITLRevision =
        await prisma.returnedIMERCCITLRevision.create({
          data: {
            IMERCCITLRevision: {
              connect: {
                id: iMERCCITLRevisionId,
              },
            },
            IDDCoordinator: {
              connect: {
                id: activeIDDCoordinator.iDDCoordinatorId,
              },
            },
          },
        });

      return res.json(returnedIMERCCITLRevision);
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

      const returnedIMERCCITLRevisions =
        await prisma.returnedIMERCCITLRevision.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedIMERCCITLRevision.count({
        where: {},
      });

      return res.json({ returnedIMERCCITLRevisions, count });
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
