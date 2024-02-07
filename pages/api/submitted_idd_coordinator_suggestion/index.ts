import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import mailTransporter from "@/services/mailTransporter";
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
        iDDCoordinatorSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { iDDCoordinatorSuggestionId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iDDCoordinatorSuggestion =
          await prisma.iDDCoordinatorSuggestion.findFirstOrThrow({
            where: {
              id: {
                equals: iDDCoordinatorSuggestionId,
              },
            },
          });
        const iDDCoordinator = await prisma.iDDCoordinator.findFirst({
          where: {
            ActiveIDDCoordinator: {
              IDDCoordinator: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });
        if (!iDDCoordinator) {
          return res.status(403).json({
            error: {
              message: "Only an active IDD coordinator can perform this action",
            },
          });
        }

        if (iDDCoordinator.id !== iDDCoordinatorSuggestion.iDDCoordinatorId) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to submit this IDD suggestion",
            },
          });
        }
      }

      const iDDCoordinatorSuggestionItemCount =
        await prisma.iDDCoordinatorSuggestionItem.count({
          where: {
            iDDCoordinatorSuggestionId: {
              equals: iDDCoordinatorSuggestionId,
            },
          },
        });
      if (iDDCoordinatorSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
      }

      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.create({
          data: {
            IDDCoordinatorSuggestion: {
              connect: {
                id: iDDCoordinatorSuggestionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED",
              },
            },
          },
        });

      const iM = await prisma.iM.findFirst({
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
                                  id: {
                                    equals: iDDCoordinatorSuggestionId,
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
      const iMOwner = await prisma.user.findFirst({
        where: {
          Faculty: {
            some: {
              IM: {
                some: {
                  id: {
                    equals: iM?.id,
                  },
                },
              },
            },
          },
        },
      });

      if (iMOwner?.email) {
        mailTransporter.sendMail(
          {
            subject: "IM CITL Review",
            text: `We are pleased to inform you that the CITL review process for your IM titled "${iM?.title}" has been successfully completed and is now ready for your revision.`,
            to: iMOwner.email,
          },
          (err) => {
            logger.error(err);
          }
        );
      }

      return res.json(submittedIDDCoordinatorSuggestion);
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
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);
      const submittedIDDCoordinatorSuggestions =
        await prisma.submittedIDDCoordinatorSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedIDDCoordinatorSuggestion.count({
        where: {},
      });

      return res.json({ submittedIDDCoordinatorSuggestions, count });
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
