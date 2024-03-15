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
        coordinatorSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const { coordinatorSuggestionId, remarks, suggestion, pageNumber } =
        validator.cast(req.body);

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
              message: "Only an active coordinator can perform this action",
            },
          });
        }

        const coordinatorReview =
          await prisma.coordinatorReview.findFirstOrThrow({
            where: {
              CoordinatorSuggestion: {
                id: {
                  equals: coordinatorSuggestionId,
                },
              },
            },
          });
        if (coordinatorReview.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this coordinator suggestion item",
            },
          });
        }

        const submittedCoordinatorSuggestion =
          await prisma.submittedCoordinatorSuggestion.findFirst({
            where: {
              CoordinatorSuggestion: {
                id: {
                  equals: coordinatorSuggestionId,
                },
              },
            },
          });
        if (submittedCoordinatorSuggestion) {
          return res.status(400).json({
            error: {
              message: "Error: Coordinator suggestion is already submitted",
            },
          });
        }
      }

      const coordinatorSuggestionItem =
        await prisma.coordinatorSuggestionItem.create({
          data: {
            remarks,
            suggestion,
            pageNumber,
            CoordinatorSuggestion: {
              connect: {
                id: coordinatorSuggestionId,
              },
            },
          },
        });

      return res.json(coordinatorSuggestionItem);
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
        "filter[coordinatorSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[coordinatorSuggestionId]": filterCoordinatorSuggestionId,
      } = validator.cast(req.query);
      const coordinatorSuggestionItems =
        await prisma.coordinatorSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                CoordinatorSuggestion: {
                  id: {
                    equals: filterCoordinatorSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.coordinatorSuggestionItem.count({
        where: {
          AND: [
            {
              CoordinatorSuggestion: {
                id: {
                  equals: filterCoordinatorSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ coordinatorSuggestionItems, count });
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
