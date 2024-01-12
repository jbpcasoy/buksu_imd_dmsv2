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
      const contentSpecialistSuggestion =
        await prisma.contentSpecialistSuggestion.findFirstOrThrow({
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

      return res.json(contentSpecialistSuggestion);
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
                id: {
                  equals: id,
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
                "Only an active content specialist can perform this action",
            },
          });
        }

        if (
          contentSpecialist.id !== contentSpecialistReview.contentSpecialistId
        ) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this content specialist suggestion",
            },
          });
        }

        const submittedContentSpecialistSuggestion =
          await prisma.submittedContentSpecialistSuggestion.findFirst({
            where: {
              ContentSpecialistSuggestion: {
                id: {
                  equals: id,
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

      const contentSpecialistSuggestion =
        await prisma.contentSpecialistSuggestion.delete({
          where: {
            id,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
