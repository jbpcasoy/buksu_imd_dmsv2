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
        returnedIMERCCITLRevisionSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { value, returnedIMERCCITLRevisionSuggestionItemId } =
        validator.cast(req.body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                IMERCCITLRevision: {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      ReturnedIMERCCITLRevision: {
                        ReturnedIMERCCITLRevisionSuggestionItem: {
                          some: {
                            id: {
                              equals: returnedIMERCCITLRevisionSuggestionItemId,
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
                "You are not allowed to create this returned IMERC CITL revision action taken",
            },
          });
        }

        const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
          where: {
            IMFile: {
              IM: {
                IMFile: {
                  some: {
                    IMERCCITLRevision: {
                      ReturnedIMERCCITLRevision: {
                        ReturnedIMERCCITLRevisionSuggestionItem: {
                          some: {
                            id: {
                              equals: returnedIMERCCITLRevisionSuggestionItemId,
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
          throw new Error(
            "Error: A revision has already been submitted for that suggestion"
          );
        }
      }

      const returnedIMERCCITLRevisionSuggestionItemActionTaken =
        await prisma.returnedIMERCCITLRevisionSuggestionItemActionTaken.create({
          data: {
            value,
            returnedIMERCCITLRevisionSuggestionItemId,
          },
        });

      return res.json(returnedIMERCCITLRevisionSuggestionItemActionTaken);
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

      const returnedIMERCCITLRevisionSuggestionItemActionTakens =
        await prisma.returnedIMERCCITLRevisionSuggestionItemActionTaken.findMany(
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
        await prisma.returnedIMERCCITLRevisionSuggestionItemActionTaken.count({
          where: {},
        });

      return res.json({
        returnedIMERCCITLRevisionSuggestionItemActionTakens,
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
