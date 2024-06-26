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
        contentSpecialistReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { contentSpecialistReviewId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const contentSpecialistReview =
          await prisma.contentSpecialistReview.findFirstOrThrow({
            where: {
              id: {
                equals: contentSpecialistReviewId,
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
                "Only an active content specialist review can perform this action",
            },
          });
        }

        if (
          contentSpecialist.id !== contentSpecialistReview.contentSpecialistId
        ) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to perform this action",
            },
          });
        }
      }

      const contentSpecialistSuggestion =
        await prisma.contentSpecialistSuggestion.create({
          data: {
            ContentSpecialistReview: {
              connect: {
                id: contentSpecialistReviewId,
              },
            },
          },
        });

      return res.json(contentSpecialistSuggestion);
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

      const contentSpecialistSuggestions =
        await prisma.contentSpecialistSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.contentSpecialistSuggestion.count({
        where: {},
      });

      return res.json({ contentSpecialistSuggestions, count });
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
