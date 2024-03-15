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

      const contentSpecialistSuggestionItem =
        await prisma.contentSpecialistSuggestionItem.findFirstOrThrow({
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

      return res.json(contentSpecialistSuggestionItem);
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
        const contentSpecialistReview =
          await prisma.contentSpecialistReview.findFirstOrThrow({
            where: {
              ContentSpecialistSuggestion: {
                ContentSpecialistSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
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
                "Only an active content specialist is not allowed to delete a content specialist suggestion item",
            },
          });
        }

        if (
          contentSpecialistReview.contentSpecialistId !== contentSpecialist.id
        ) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this content specialist suggestion item",
            },
          });
        }

        const submittedContentSpecialistSuggestion =
          await prisma.submittedContentSpecialistSuggestion.findFirst({
            where: {
              ContentSpecialistSuggestion: {
                ContentSpecialistSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
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
      }

      const submittedContentSpecialistSuggestion =
        await prisma.submittedContentSpecialistSuggestion.findFirst({
          where: {
            ContentSpecialistSuggestion: {
              ContentSpecialistSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        });

      const contentSpecialistSuggestionItem =
        await prisma.contentSpecialistSuggestionItem.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
      });

      await validator.validate(req.body);

      const { id } = req.query;
      const { remarks, suggestion, pageNumber } = validator.cast(req.body);

      if (!user.isAdmin) {
        const contentSpecialistReview =
          await prisma.contentSpecialistReview.findFirstOrThrow({
            where: {
              ContentSpecialistSuggestion: {
                ContentSpecialistSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
                "Only an active content specialist is allowed to perform this action",
            },
          });
        }

        if (
          contentSpecialistReview.contentSpecialistId !== contentSpecialist.id
        ) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this content specialist suggestion item",
            },
          });
        }

        const submittedContentSpecialistSuggestion =
          await prisma.submittedContentSpecialistSuggestion.findFirst({
            where: {
              ContentSpecialistSuggestion: {
                ContentSpecialistSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
      }

      const contentSpecialistSuggestionItem =
        await prisma.contentSpecialistSuggestionItem.update({
          where: {
            id: id as string,
          },
          data: {
            remarks,
            suggestion,
            pageNumber,
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
