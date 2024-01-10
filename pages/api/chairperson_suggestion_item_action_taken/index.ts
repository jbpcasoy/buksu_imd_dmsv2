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
        chairpersonSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { value, chairpersonSuggestionItemId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  ChairpersonReview: {
                    ChairpersonSuggestion: {
                      SubmittedChairpersonSuggestion: {
                        ChairpersonSuggestion: {
                          ChairpersonSuggestionItem: {
                            some: {
                              id: {
                                equals: chairpersonSuggestionItemId,
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

        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this chairperson suggestion action taken",
            },
          });
        }

        const departmentRevision = await prisma.departmentRevision.findFirst({
          where: {
            IMFile: {
              IM: {
                IMFile: {
                  some: {
                    DepartmentReview: {
                      ChairpersonReview: {
                        ChairpersonSuggestion: {
                          ChairpersonSuggestionItem: {
                            some: {
                              id: {
                                equals: chairpersonSuggestionItemId,
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

      const chairpersonSuggestionItemActionTaken =
        await prisma.chairpersonSuggestionItemActionTaken.create({
          data: {
            value,
            chairpersonSuggestionItemId,
          },
        });

      return res.json(chairpersonSuggestionItemActionTaken);
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

      const chairpersonSuggestionItemActionTakens =
        await prisma.chairpersonSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.chairpersonSuggestionItemActionTaken.count({
        where: {},
      });

      return res.json({ chairpersonSuggestionItemActionTakens, count });
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
