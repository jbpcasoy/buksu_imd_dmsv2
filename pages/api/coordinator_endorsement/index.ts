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

      const { departmentRevisionId, activeCoordinatorId } = validator.cast(
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
        if (!faculty) {
          return res.status(403).json({
            error: {
              message:
                "Only an active coordinator is allowed to perform this action",
            },
          });
        }

        if (faculty.userId !== user.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a coordinator endorsement for this user",
            },
          });
        }

        const iMOwner = await prisma.faculty.findFirstOrThrow({
          where: {
            IM: {
              some: {
                IMFile: {
                  some: {
                    DepartmentReview: {
                      CoordinatorReview: {
                        CoordinatorSuggestion: {
                          SubmittedCoordinatorSuggestion: {
                            DepartmentReviewed: {
                              DepartmentRevision: {
                                some: {
                                  id: {
                                    equals: departmentRevisionId,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (faculty.departmentId !== iMOwner.departmentId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to endorse IMs from another department",
            },
          });
        }

        const submittedReturnedDepartmentRevision =
          await prisma.submittedReturnedDepartmentRevision.findFirst({
            where: {
              ReturnedDepartmentRevision: {
                DepartmentRevision: {
                  id: departmentRevisionId,
                },
              },
            },
          });
        if (submittedReturnedDepartmentRevision) {
          return res.status(400).json({
            error: {
              message: "Error: This department revision is returned",
            },
          });
        }
      }

      const coordinator = await prisma.coordinator.findFirstOrThrow({
        where: {
          ActiveCoordinator: {
            id: {
              equals: activeCoordinatorId,
            },
          },
        },
      });

      const coordinatorEndorsement = await prisma.coordinatorEndorsement.create(
        {
          data: {
            Coordinator: {
              connect: {
                id: coordinator.id,
              },
            },
            DepartmentRevision: {
              connect: {
                id: departmentRevisionId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "COORDINATOR_ENDORSEMENT_CREATED",
              },
            },
          },
        }
      );

      return res.json(coordinatorEndorsement);
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
      const coordinatorEndorsements =
        await prisma.coordinatorEndorsement.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.coordinatorEndorsement.count({
        where: {},
      });

      return res.json({ coordinatorEndorsements, count });
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
