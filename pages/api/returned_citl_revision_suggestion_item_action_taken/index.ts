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
        returnedCITLRevisionSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { value, returnedCITLRevisionSuggestionItemId } = validator.cast(
        req.body
      );

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
                                          ReturnedCITLRevision: {
                                            SubmittedReturnedCITLRevision: {
                                              ReturnedCITLRevision: {
                                                ReturnedCITLRevisionSuggestionItem:
                                                  {
                                                    some: {
                                                      id: {
                                                        equals:
                                                          returnedCITLRevisionSuggestionItemId,
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
                  id: user.id,
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
                "You are not allowed to create this returned citl revision suggestion item action taken",
            },
          });
        }

        const cITLRevision = await prisma.cITLRevision.findFirst({
          where: {
            IMFile: {
              IM: {
                IMFile: {
                  some: {
                    CITLRevision: {
                      ReturnedCITLRevision: {
                        ReturnedCITLRevisionSuggestionItem: {
                          some: {
                            id: {
                              equals: returnedCITLRevisionSuggestionItemId,
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
                ReturnedCITLRevision: {
                  is: null,
                },
              },
              {
                ReturnedCITLRevision: {
                  SubmittedReturnedCITLRevision: {
                    is: null,
                  },
                },
              },
            ],
          },
        });
        if (cITLRevision) {
          throw new Error(
            "Error: A revision has already been submitted for that suggestion"
          );
        }
      }

      const returnedCITLRevisionSuggestionItemActionTaken =
        await prisma.returnedCITLRevisionSuggestionItemActionTaken.create({
          data: {
            value,
            returnedCITLRevisionSuggestionItemId,
          },
        });

      return res.json(returnedCITLRevisionSuggestionItemActionTaken);
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

      const returnedCITLRevisionSuggestionItemActionTakens =
        await prisma.returnedCITLRevisionSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count =
        await prisma.returnedCITLRevisionSuggestionItemActionTaken.count({
          where: {},
        });

      return res.json({
        returnedCITLRevisionSuggestionItemActionTakens,
        count,
      });
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
