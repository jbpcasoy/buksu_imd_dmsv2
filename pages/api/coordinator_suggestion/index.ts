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
        coordinatorReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { coordinatorReviewId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const coordinator = await prisma.coordinator.findFirst({
          where: {
            ActiveCoordinator: {
              Coordinator: {
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
        if (!coordinator) {
          return res.status(403).json({
            error: {
              message:
                "Only an active coordinator is allowed to perform this action",
            },
          });
        }

        const coordinatorReview =
          await prisma.coordinatorReview.findFirstOrThrow({
            where: {
              id: {
                equals: coordinatorReviewId,
              },
            },
          });
        if (coordinatorReview.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a coordinator suggestion for this coordinator review",
            },
          });
        }
      }

      const coordinatorSuggestion = await prisma.coordinatorSuggestion.create({
        data: {
          CoordinatorReview: {
            connect: {
              id: coordinatorReviewId,
            },
          },
        },
      });

      return res.json(coordinatorSuggestion);
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

      const coordinatorSuggestions =
        await prisma.coordinatorSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.coordinatorSuggestion.count({
        where: {},
      });

      return res.json({ coordinatorSuggestions, count });
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
