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
        contentEditorSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        actionTaken,
        contentEditorSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      if (!user.isAdmin) {
        const contentEditorReview =
          await prisma.contentEditorReview.findFirstOrThrow({
            where: {
              ContentEditorSuggestion: {
                id: {
                  equals: contentEditorSuggestionId,
                },
              },
            },
          });

        const cITLDirector = await prisma.cITLDirector.findFirst({
          where: {
            ActiveCITLDirector: {
              CITLDirector: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });
        if (!cITLDirector) {
          return res.status(403).json({
            error: {
              message: "Only an active CITl director can perform this action",
            },
          });
        }

        if (contentEditorReview.cITLDirectorId !== cITLDirector.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this content editor suggestion item",
            },
          });
        }

        const submittedContentEditorSuggestion =
          await prisma.submittedContentEditorSuggestion.findFirst({
            where: {
              ContentEditorSuggestion: {
                id: {
                  equals: contentEditorSuggestionId,
                },
              },
            },
          });

        if (submittedContentEditorSuggestion) {
          return res.status(400).json({
            error: {
              message: "Error: Content editor suggestion is already submitted",
            },
          });
        }
      }

      const contentEditorSuggestionItem =
        await prisma.contentEditorSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ContentEditorSuggestion: {
              connect: {
                id: contentEditorSuggestionId,
              },
            },
          },
        });

      return res.json(contentEditorSuggestionItem);
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
        "filter[contentEditorSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[contentEditorSuggestionId]": filterContentEditorSuggestionId,
      } = validator.cast(req.query);
      const contentEditorSuggestionItems =
        await prisma.contentEditorSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                ContentEditorSuggestion: {
                  id: {
                    equals: filterContentEditorSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.contentEditorSuggestionItem.count({
        where: {
          AND: [
            {
              ContentEditorSuggestion: {
                id: {
                  equals: filterContentEditorSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ contentEditorSuggestionItems, count });
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
