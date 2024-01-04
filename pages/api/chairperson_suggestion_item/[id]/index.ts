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

      const chairpersonSuggestionItem =
        await prisma.chairpersonSuggestionItem.findFirstOrThrow({
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

      return res.json(chairpersonSuggestionItem);
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
              message: "Only an active chairperson can perform this action",
            },
          });
        }

        const chairpersonReview =
          await prisma.chairpersonReview.findFirstOrThrow({
            where: {
              ChairpersonSuggestion: {
                ChairpersonSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          });
        if (chairpersonReview.chairpersonId !== chairperson.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this chairperson suggestion item",
            },
          });
        }

        const submittedChairpersonSuggestion =
          await prisma.submittedChairpersonSuggestion.findFirst({
            where: {
              ChairpersonSuggestion: {
                ChairpersonSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          });
        if (submittedChairpersonSuggestion) {
          return res.status(400).json({
            error: {
              message: "Chairperson suggestion is submitted",
            },
          });
        }
      }

      const chairpersonSuggestionItem =
        await prisma.chairpersonSuggestionItem.delete({
          where: {
            id,
          },
        });

      return res.json(chairpersonSuggestionItem);
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
        pageNumber: Yup.number().min(0).optional(),
        suggestion: Yup.string().optional(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });

      await validator.validate(req.body);
      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

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
              message: "Only an active chairperson can perform this action",
            },
          });
        }

        const chairpersonReview =
          await prisma.chairpersonReview.findFirstOrThrow({
            where: {
              ChairpersonSuggestion: {
                ChairpersonSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          });
        if (chairpersonReview.chairpersonId !== chairperson.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this chairperson suggestion item",
            },
          });
        }

        const submittedChairpersonSuggestion =
          await prisma.submittedChairpersonSuggestion.findFirst({
            where: {
              ChairpersonSuggestion: {
                ChairpersonSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          });
        if (submittedChairpersonSuggestion) {
          return res.status(400).json({
            error: {
              message: "Chairperson suggestion is submitted",
            },
          });
        }
      }

      const chairpersonSuggestionItem =
        await prisma.chairpersonSuggestionItem.update({
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

      return res.json(chairpersonSuggestionItem);
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
