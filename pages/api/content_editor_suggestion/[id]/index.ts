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
      const contentEditorSuggestion =
        await prisma.contentEditorSuggestion.findFirstOrThrow({
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

      return res.json(contentEditorSuggestion);
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
                id: {
                  equals: id,
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
              message: "Only an active CITL director can perform this action",
            },
          });
        }

        if (contentEditorReview.cITLDirectorId !== cITLDirector.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this content editor suggestion",
            },
          });
        }

        const submittedContentEditorSuggestion =
          await prisma.submittedContentEditorSuggestion.findFirst({
            where: {
              ContentEditorSuggestion: {
                id: {
                  equals: id,
                },
              },
            },
          });
        if (submittedContentEditorSuggestion) {
          return res.status(403).json({
            error: {
              message: "Error: Content editor suggestion is already submitted",
            },
          });
        }
      }

      const contentEditorSuggestion =
        await prisma.contentEditorSuggestion.delete({
          where: {
            id,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
