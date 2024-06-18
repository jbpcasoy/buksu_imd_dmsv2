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
        coordinatorEndorsementId: Yup.string().required(),
        activeDeanId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { coordinatorEndorsementId, activeDeanId } = validator.cast(
        req.body
      );

      if (!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                Dean: {
                  ActiveDean: {
                    id: {
                      equals: activeDeanId,
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
              message: "Only an active dean can perform this action",
            },
          });
        }

        if (faculty.userId !== user.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a dean endorsement for this user",
            },
          });
        }

        const facultyCollege = await prisma.college.findFirstOrThrow({
          where: {
            Department: {
              some: {
                id: {
                  equals: faculty.departmentId,
                },
              },
            },
          },
        });
        const iMCollege = await prisma.college.findFirstOrThrow({
          where: {
            Department: {
              some: {
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
                                            id: {
                                              equals: coordinatorEndorsementId,
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

        if (facultyCollege.id !== iMCollege.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to endorse IMs from another college",
            },
          });
        }
      }

      const dean = await prisma.dean.findFirstOrThrow({
        where: {
          ActiveDean: {
            id: {
              equals: activeDeanId,
            },
          },
        },
      });

      const deanEndorsement = await prisma.deanEndorsement.create({
        data: {
          Dean: {
            connect: {
              id: dean.id,
            },
          },
          CoordinatorEndorsement: {
            connect: {
              id: coordinatorEndorsementId,
            },
          },
          Event: {
            create: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              type: "DEAN_ENDORSEMENT_CREATED",
            },
          },
        },
      });

      return res.json(deanEndorsement);
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
      const deanEndorsements = await prisma.deanEndorsement.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.deanEndorsement.count({
        where: {},
      });

      return res.json({ deanEndorsements, count });
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
