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
        contentEditorReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { contentEditorReviewId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const contentEditorReview =
          await prisma.contentEditorReview.findFirstOrThrow({
            where: {
              id: {
                equals: contentEditorReviewId,
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
              message: "You are not allowed to perform this action",
            },
          });
        }

        if (cITLDirector.id !== contentEditorReview.cITLDirectorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this content editor suggestion",
            },
          });
        }
      }

      const contentEditorSuggestion =
        await prisma.contentEditorSuggestion.create({
          data: {
            ContentEditorReview: {
              connect: {
                id: contentEditorReviewId,
              },
            },
          },
        });

      return res.json(contentEditorSuggestion);
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

      const contentEditorSuggestions =
        await prisma.contentEditorSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.contentEditorSuggestion.count({
        where: {},
      });

      return res.json({ contentEditorSuggestions, count });
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
