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
        qAMISRevisionId: Yup.string().required(),
        activeCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { qAMISRevisionId, activeCoordinatorId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iMDepartment = await prisma.department.findFirstOrThrow({
          where: {
            Faculty: {
              some: {
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
                                      CoordinatorEndorsement: {
                                        DeanEndorsement: {
                                          IDDCoordinatorSuggestion: {
                                            SubmittedIDDCoordinatorSuggestion: {
                                              CITLRevision: {
                                                some: {
                                                  IDDCoordinatorEndorsement: {
                                                    CITLDirectorEndorsement: {
                                                      QAMISSuggestion: {
                                                        SubmittedQAMISSuggestion:
                                                          {
                                                            QAMISRevision: {
                                                              id: {
                                                                equals:
                                                                  qAMISRevisionId,
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

        const coordinatorDepartment = await prisma.department.findFirst({
          where: {
            Faculty: {
              some: {
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
        if (!coordinatorDepartment) {
          return res.status(403).json({
            error: {
              message:
                "Only an active coordinator is allowed to perform this action",
            },
          });
        }

        if (coordinatorDepartment.id !== iMDepartment.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to endorse an IM from another department",
            },
          });
        }

        const faculty = await prisma.faculty.findFirstOrThrow({
          where: {
            Coordinator: {
              ActiveCoordinator: {
                id: {
                  equals: activeCoordinatorId,
                },
              },
            },
          },
        });
        if (faculty.userId !== user.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to endorse an IM for this user",
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

      const qAMISCoordinatorEndorsement =
        await prisma.qAMISCoordinatorEndorsement.create({
          data: {
            Coordinator: {
              connect: {
                id: coordinator.id,
              },
            },
            QAMISRevision: {
              connect: {
                id: qAMISRevisionId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "QAMIS_COORDINATOR_ENDORSEMENT_CREATED",
              },
            },
          },
        });

      const qAMISChairpersonEndorsement =
        await prisma.qAMISChairpersonEndorsement.findFirst({
          where: {
            QAMISRevision: {
              QAMISCoordinatorEndorsement: {
                id: {
                  equals: qAMISCoordinatorEndorsement.id,
                },
              },
            },
          },
        });

      const qAMISDeanEndorsement = await prisma.qAMISDeanEndorsement.findFirst({
        where: {
          QAMISRevision: {
            QAMISCoordinatorEndorsement: {
              id: {
                equals: qAMISCoordinatorEndorsement.id,
              },
            },
          },
        },
      });

      if (
        qAMISChairpersonEndorsement &&
        qAMISCoordinatorEndorsement &&
        qAMISDeanEndorsement
      ) {
        await prisma.qAMISDepartmentEndorsement.create({
          data: {
            QAMISChairpersonEndorsement: {
              connect: {
                id: qAMISChairpersonEndorsement.id,
              },
            },
            QAMISCoordinatorEndorsement: {
              connect: {
                id: qAMISCoordinatorEndorsement.id,
              },
            },
            QAMISDeanEndorsement: {
              connect: {
                id: qAMISDeanEndorsement.id,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "QAMIS_DEPARTMENT_ENDORSEMENT_CREATED",
              },
            },
          },
        });
      }

      return res.json(qAMISCoordinatorEndorsement);
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
      const qAMISCoordinatorEndorsements =
        await prisma.qAMISCoordinatorEndorsement.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.qAMISCoordinatorEndorsement.count({
        where: {},
      });

      return res.json({ qAMISCoordinatorEndorsements, count });
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
