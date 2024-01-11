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
        qAMISSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        actionTaken,
        qAMISSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
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
                                                id: {
                                                  equals: qAMISSuggestionId,
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

        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });
        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty can perform this action",
            },
          });
        }

        if (faculty.id !== iM.facultyId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this QAMIS suggestion item",
            },
          });
        }

        const submittedQAMISSuggestion =
          await prisma.submittedQAMISSuggestion.findFirst({
            where: {
              QAMISSuggestion: {
                id: {
                  equals: qAMISSuggestionId,
                },
              },
            },
          });

        if (submittedQAMISSuggestion) {
          return res.status(400).json({
            error: {
              message: "Error: QAMIS suggestion is already submitted",
            },
          });
        }
      }

      const qAMISSuggestionItem = await prisma.qAMISSuggestionItem.create({
        data: {
          actionTaken,
          remarks,
          suggestion,
          pageNumber,
          QAMISSuggestion: {
            connect: {
              id: qAMISSuggestionId,
            },
          },
        },
      });

      return res.json(qAMISSuggestionItem);
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
        "filter[qAMISSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[qAMISSuggestionId]": filterQAMISSuggestionId,
      } = validator.cast(req.query);
      const qAMISSuggestionItems = await prisma.qAMISSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              QAMISSuggestion: {
                id: {
                  equals: filterQAMISSuggestionId,
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.qAMISSuggestionItem.count({
        where: {
          AND: [
            {
              QAMISSuggestion: {
                id: {
                  equals: filterQAMISSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ qAMISSuggestionItems, count });
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
