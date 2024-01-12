import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
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
        contentSpecialistSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        actionTaken,
        contentSpecialistSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      if (!user.isAdmin) {
        const contentSpecialistReview =
          await prisma.contentSpecialistReview.findFirstOrThrow({
            where: {
              ContentSpecialistSuggestion: {
                id: {
                  equals: contentSpecialistSuggestionId,
                },
              },
            },
          });

        const contentSpecialist = await prisma.contentSpecialist.findFirst({
          where: {
            ActiveContentSpecialist: {
              ContentSpecialist: {
                Faculty: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        });
        if (!contentSpecialist) {
          return res.status(403).json({
            error: {
              message:
                "Only an active content specialist can perform this action",
            },
          });
        }

        if (
          contentSpecialistReview.contentSpecialistId !== contentSpecialist.id
        ) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this content specialist suggestion item",
            },
          });
        }

        const submittedContentSpecialistSuggestion =
          await prisma.submittedContentSpecialistSuggestion.findFirst({
            where: {
              ContentSpecialistSuggestion: {
                id: {
                  equals: contentSpecialistSuggestionId,
                },
              },
            },
          });
        if (submittedContentSpecialistSuggestion) {
          return res.status(403).json({
            error: {
              message:
                "Error: content specialist suggestion is already submitted",
            },
          });
        }
      }

      const submittedContentSpecialistSuggestion =
        await prisma.submittedContentSpecialistSuggestion.findFirst({
          where: {
            ContentSpecialistSuggestion: {
              id: {
                equals: contentSpecialistSuggestionId,
              },
            },
          },
        });

      if (submittedContentSpecialistSuggestion) {
        return res.status(400).json({
          error: {
            message:
              "Error: Content specialist suggestion is already submitted",
          },
        });
      }

      const contentSpecialistSuggestionItem =
        await prisma.contentSpecialistSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ContentSpecialistSuggestion: {
              connect: {
                id: contentSpecialistSuggestionId,
              },
            },
          },
        });

      return res.json(contentSpecialistSuggestionItem);
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
        "filter[contentSpecialistSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[contentSpecialistSuggestionId]":
          filterContentSpecialistSuggestionId,
      } = validator.cast(req.query);
      const contentSpecialistSuggestionItems =
        await prisma.contentSpecialistSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                ContentSpecialistSuggestion: {
                  id: {
                    equals: filterContentSpecialistSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.contentSpecialistSuggestionItem.count({
        where: {
          AND: [
            {
              ContentSpecialistSuggestion: {
                id: {
                  equals: filterContentSpecialistSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ contentSpecialistSuggestionItems, count });
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
