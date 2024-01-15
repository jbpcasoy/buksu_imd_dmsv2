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

      const contentEditorSuggestionItem =
        await prisma.contentEditorSuggestionItem.findFirstOrThrow({
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

      return res.json(contentEditorSuggestionItem);
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
        const contentEditorReview =
          await prisma.contentEditorReview.findFirstOrThrow({
            where: {
              ContentEditorSuggestion: {
                ContentEditorSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
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
              message: "Only an active allowed to perform this action",
            },
          });
        }

        if (cITLDirector.id !== contentEditorReview.cITLDirectorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this content editor suggestion item",
            },
          });
        }

        const submittedContentEditorSuggestion =
          await prisma.submittedContentEditorSuggestion.findFirst({
            where: {
              ContentEditorSuggestion: {
                ContentEditorSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          });

        if (submittedContentEditorSuggestion) {
          return res.status(400).json({
            error: {
              message: "Error: content editor suggestion is already submitted",
            },
          });
        }
      }

      const contentEditorSuggestionItem =
        await prisma.contentEditorSuggestionItem.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
      });

      await validator.validate(req.body);

      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

      if (!user.isAdmin) {
        const contentEditorReview =
          await prisma.contentEditorReview.findFirstOrThrow({
            where: {
              ContentEditorSuggestion: {
                ContentEditorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
              message: "Only an active allowed to perform this action",
            },
          });
        }

        if (cITLDirector.id !== contentEditorReview.cITLDirectorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this content editor suggestion item",
            },
          });
        }

        const submittedContentEditorSuggestion =
          await prisma.submittedContentEditorSuggestion.findFirst({
            where: {
              ContentEditorSuggestion: {
                ContentEditorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          });

        if (submittedContentEditorSuggestion) {
          return res.status(400).json({
            error: {
              message: "Error: content editor suggestion is already submitted",
            },
          });
        }
      }

      const contentEditorSuggestionItem =
        await prisma.contentEditorSuggestionItem.update({
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

      return res.json(contentEditorSuggestionItem);
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
