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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const coordinatorSuggestionItem =
        await prisma.coordinatorSuggestionItem.findFirstOrThrow({
          where: {
            AND: [
              {
                id: {
                  equals: id,
                },
              },
            ],
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

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);

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
                CoordinatorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          });
        if (coordinatorReview.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this coordinator suggestion item",
            },
          });
        }

        const submittedCoordinatorSuggestion =
          await prisma.submittedCoordinatorSuggestion.findFirst({
            where: {
              CoordinatorSuggestion: {
                CoordinatorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
        await prisma.coordinatorSuggestionItem.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        actionTaken: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
      });

      await validator.validate(req.body);

      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

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
                CoordinatorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          });
        if (coordinatorReview.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this coordinator suggestion item",
            },
          });
        }

        const submittedCoordinatorSuggestion =
          await prisma.submittedCoordinatorSuggestion.findFirst({
            where: {
              CoordinatorSuggestion: {
                CoordinatorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
        await prisma.coordinatorSuggestionItem.update({
          where: {
            id: id as string,
          },
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
