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
        returnedDepartmentRevisionSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { value, returnedDepartmentRevisionSuggestionItemId } =
        validator.cast(req.body);

      if (!user.isAdmin) {
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
                              ReturnedDepartmentRevision: {
                                ReturnedDepartmentRevisionSuggestionItem: {
                                  some: {
                                    id: {
                                      equals:
                                        returnedDepartmentRevisionSuggestionItemId,
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

        if (faculty.id !== iM.facultyId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this returned department revision suggestion item action taken",
            },
          });
        }

        const departmentRevision = await prisma.departmentRevision.findFirst({
          where: {
            IMFile: {
              IM: {
                IMFile: {
                  some: {
                    DepartmentRevision: {
                      ReturnedDepartmentRevision: {
                        ReturnedDepartmentRevisionSuggestionItem: {
                          some: {
                            id: {
                              equals:
                                returnedDepartmentRevisionSuggestionItemId,
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
                ReturnedDepartmentRevision: {
                  is: null,
                },
              },
              {
                ReturnedDepartmentRevision: {
                  SubmittedReturnedDepartmentRevision: {
                    is: null,
                  },
                },
              },
            ],
          },
        });
        if (departmentRevision) {
          throw new Error("IM already revised.");
        }
      }

      const returnedDepartmentRevisionSuggestionItemActionTaken =
        await prisma.returnedDepartmentRevisionSuggestionItemActionTaken.create(
          {
            data: {
              value,
              returnedDepartmentRevisionSuggestionItemId,
            },
          }
        );

      return res.json(returnedDepartmentRevisionSuggestionItemActionTaken);
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

      const returnedDepartmentRevisionSuggestionItemActionTakens =
        await prisma.returnedDepartmentRevisionSuggestionItemActionTaken.findMany(
          {
            skip,
            take,
            where: {},
            orderBy: {
              updatedAt: "desc",
            },
          }
        );
      const count =
        await prisma.returnedDepartmentRevisionSuggestionItemActionTaken.count({
          where: {},
        });

      return res.json({
        returnedDepartmentRevisionSuggestionItemActionTakens,
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
