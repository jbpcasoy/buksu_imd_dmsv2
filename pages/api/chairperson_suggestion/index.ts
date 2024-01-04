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
        chairpersonReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { chairpersonReviewId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const chairperson = await prisma.chairperson.findFirst({
          where: {
            ActiveChairperson: {
              Chairperson: {
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
        if (!chairperson) {
          return res.status(403).json({
            error: {
              message:
                "Only an active chairperson is allowed to perform this action",
            },
          });
        }

        const chairpersonReview =
          await prisma.chairpersonReview.findFirstOrThrow({
            where: {
              id: {
                equals: chairpersonReviewId,
              },
            },
          });
        if (chairpersonReview.chairpersonId !== chairperson.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a chairperson suggestion for this chairperson review",
            },
          });
        }
      }

      const chairpersonSuggestion = await prisma.chairpersonSuggestion.create({
        data: {
          ChairpersonReview: {
            connect: {
              id: chairpersonReviewId,
            },
          },
        },
      });

      return res.json(chairpersonSuggestion);
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

      const chairpersonSuggestions =
        await prisma.chairpersonSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.chairpersonSuggestion.count({
        where: {},
      });

      return res.json({ chairpersonSuggestions, count });
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
