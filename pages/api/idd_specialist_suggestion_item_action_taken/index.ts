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
        value: Yup.string().required(),
        iDDSpecialistSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { value, iDDSpecialistSuggestionItemId } = validator.cast(req.body);

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
                                                SubmittedQAMISSuggestion: {
                                                  QAMISRevision: {
                                                    QAMISDeanEndorsement: {
                                                      QAMISDepartmentEndorsement:
                                                        {
                                                          IDDSpecialistReview: {
                                                            IDDSpecialistSuggestion:
                                                              {
                                                                SubmittedIDDSpecialistSuggestion:
                                                                  {
                                                                    IDDSpecialistSuggestion:
                                                                      {
                                                                        IDDSpecialistSuggestionItem:
                                                                          {
                                                                            some: {
                                                                              id: {
                                                                                equals:
                                                                                  iDDSpecialistSuggestionItemId,
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
              message: "Only an active CITL director can perform this action",
            },
          });
        }

        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this IDD specialist suggestion item action taken",
            },
          });
        }
      }

      const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
        where: {
          IMFile: {
            IM: {
              IMFile: {
                some: {
                  IMERCCITLRevision: {
                    IMERCCITLReviewed: {
                      SubmittedIDDSpecialistSuggestion: {
                        IDDSpecialistSuggestion: {
                          IDDSpecialistSuggestionItem: {
                            some: {
                              id: {
                                equals: iDDSpecialistSuggestionItemId,
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
          OR: [
            {
              ReturnedIMERCCITLRevision: {
                is: null,
              },
            },
            {
              ReturnedIMERCCITLRevision: {
                SubmittedReturnedIMERCCITLRevision: {
                  is: null,
                },
              },
            },
          ],
        },
      });
      if (iMERCCITLRevision) {
        throw new Error("Error: IM is already revised");
      }

      const iDDSpecialistSuggestionItemActionTaken =
        await prisma.iDDSpecialistSuggestionItemActionTaken.create({
          data: {
            value,
            iDDSpecialistSuggestionItemId,
          },
        });

      return res.json(iDDSpecialistSuggestionItemActionTaken);
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

      const iDDSpecialistSuggestionItemActionTakens =
        await prisma.iDDSpecialistSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDSpecialistSuggestionItemActionTaken.count({
        where: {
          AND: [],
        },
      });

      return res.json({ iDDSpecialistSuggestionItemActionTakens, count });
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
