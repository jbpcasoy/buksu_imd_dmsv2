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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const returnedDepartmentRevision =
        await prisma.returnedDepartmentRevision.findFirstOrThrow({
          where: {
            AND: [
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(returnedDepartmentRevision);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);

      if (!user.isAdmin) {
        const coordinator = await prisma.coordinator.findFirst({
          where: {
            ActiveCoordinator: {
              Coordinator: {
                Faculty: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        });
        if (!coordinator) {
          return res.status(403).json({
            error: {
              message:
                "Only an active coordinator is allowed to perform this action",
            },
          });
        }

        const returnedDepartmentRevision =
          await prisma.returnedDepartmentRevision.findFirstOrThrow({
            where: {
              id: {
                equals: id,
              },
            },
          });
        if (returnedDepartmentRevision.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this returned department revision",
            },
          });
        }

        const submittedReturnedDepartmentRevision =
          await prisma.submittedReturnedDepartmentRevision.findFirst({
            where: {
              ReturnedDepartmentRevision: {
                id: {
                  equals: id,
                },
              },
            },
          });
        if (submittedReturnedDepartmentRevision) {
          return res.status(400).json({
            error: {
              message:
                "You are not allowed to delete a submitted returned department revision",
            },
          });
        }

        const coordinatorEndorsement =
          await prisma.coordinatorEndorsement.findFirst({
            where: {
              DepartmentRevision: {
                AND: [
                  {
                    IMFile: {
                      IM: {
                        IMFile: {
                          some: {
                            DepartmentRevision: {
                              CoordinatorEndorsement: {
                                isNot: null,
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
                            DepartmentRevision: {
                              ReturnedDepartmentRevision: {
                                id: {
                                  equals: id,
                                },
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

        if (coordinatorEndorsement) {
          return res.status(400).json({
            error: {
              message: "IM is already endorsed by the coordinator",
            },
          });
        }
      }

      const returnedDepartmentRevision =
        await prisma.returnedDepartmentRevision.delete({
          where: {
            id,
          },
        });

      return res.json(returnedDepartmentRevision);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
