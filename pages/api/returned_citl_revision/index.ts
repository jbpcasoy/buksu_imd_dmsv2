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

      const { activeIDDCoordinatorId, cITLRevisionId } = validator.cast(
        req.body
      );

      if (!user.isAdmin) {
        const iDDCoordinator = await prisma.iDDCoordinator.findFirst({
          where: {
            ActiveIDDCoordinator: {
              IDDCoordinator: {
                User: {
                  id: user.id,
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
      }

      const iDDCoordinatorEndorsement =
        await prisma.iDDCoordinatorEndorsement.findFirst({
          where: {
            CITLRevision: {
              AND: [
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          CITLRevision: {
                            id: {
                              equals: cITLRevisionId,
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
                          CITLRevision: {
                            IDDCoordinatorEndorsement: {
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

      if (iDDCoordinatorEndorsement) {
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

      const returnedCITLRevision = await prisma.returnedCITLRevision.create({
        data: {
          CITLRevision: {
            connect: {
              id: cITLRevisionId,
            },
          },
          IDDCoordinator: {
            connect: {
              id: activeIDDCoordinator.iDDCoordinatorId,
            },
          },
        },
      });

      return res.json(returnedCITLRevision);
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

      const returnedCITLRevisions = await prisma.returnedCITLRevision.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.returnedCITLRevision.count({
        where: {},
      });

      return res.json({ returnedCITLRevisions, count });
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
