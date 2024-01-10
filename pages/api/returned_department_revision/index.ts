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
        departmentRevisionId: Yup.string().required(),
        activeCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { activeCoordinatorId, departmentRevisionId } = validator.cast(
        req.body
      );

      if (!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                Coordinator: {
                  ActiveCoordinator: {
                    id: {
                      equals: activeCoordinatorId,
                    },
                  },
                },
              },
            },
          },
        });

        const iMOwner = await prisma.faculty.findFirstOrThrow({
          where: {
            IM: {
              some: {
                IMFile: {
                  some: {
                    DepartmentRevision: {
                      id: {
                        equals: departmentRevisionId,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (faculty && faculty.userId !== user.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to return an IM for this user",
            },
          });
        }

        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active coordinator can perform this action.",
            },
          });
        }

        if (iMOwner.userId !== faculty.userId)
          if (iMOwner.departmentId !== faculty.departmentId) {
            return res.status(403).json({
              error: {
                message:
                  "You are not allowed to return IMs outside your department",
              },
            });
          }
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
                            id: {
                              equals: departmentRevisionId,
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
                            CoordinatorEndorsement: {
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

      if (coordinatorEndorsement) {
        throw new Error("IM already endorsed by coordinator");
      }

      const activeCoordinator = await prisma.activeCoordinator.findFirstOrThrow(
        {
          where: {
            id: {
              equals: activeCoordinatorId,
            },
          },
        }
      );

      const returnedDepartmentRevision =
        await prisma.returnedDepartmentRevision.create({
          data: {
            DepartmentRevision: {
              connect: {
                id: departmentRevisionId,
              },
            },
            Coordinator: {
              connect: {
                id: activeCoordinator.coordinatorId,
              },
            },
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

      const returnedDepartmentRevisions =
        await prisma.returnedDepartmentRevision.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedDepartmentRevision.count({
        where: {},
      });

      return res.json({ returnedDepartmentRevisions, count });
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
