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
        peerSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { value, peerSuggestionItemId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  PeerReview: {
                    PeerSuggestion: {
                      PeerSuggestionItem: {
                        some: {
                          id: peerSuggestionItemId,
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
              message:
                "Only an active faculty is allowed to perform this action",
            },
          });
        }

        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this peer suggestion item action taken",
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
                      PeerReview: {
                        PeerSuggestion: {
                          PeerSuggestionItem: {
                            some: {
                              id: {
                                equals: peerSuggestionItemId,
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

      const peerSuggestionItemActionTaken =
        await prisma.peerSuggestionItemActionTaken.create({
          data: {
            value,
            peerSuggestionItemId,
          },
        });

      return res.json(peerSuggestionItemActionTaken);
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

      const peerSuggestionItemActionTakens =
        await prisma.peerSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.peerSuggestionItemActionTaken.count({
        where: {},
      });

      return res.json({ peerSuggestionItemActionTakens, count });
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
