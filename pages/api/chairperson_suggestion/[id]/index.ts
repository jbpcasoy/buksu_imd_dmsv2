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

      const chairpersonSuggestion =
        await prisma.chairpersonSuggestion.findFirstOrThrow({
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

      return res.json(chairpersonSuggestion);
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
              message:
                "Only an active chairperson is allowed to perform this action",
            },
          });
        }

        const chairpersonReview =
          await prisma.chairpersonReview.findFirstOrThrow({
            where: {
              ChairpersonSuggestion: {
                id: {
                  equals: id,
                },
              },
            },
          });
        if (chairpersonReview.chairpersonId !== chairperson.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this chairperson suggestion",
            },
          });
        }

        const submittedChairpersonSuggestion =
          await prisma.submittedChairpersonSuggestion.findFirst({
            where: {
              ChairpersonSuggestion: {
                id: {
                  equals: id,
                },
              },
            },
          });
        if (submittedChairpersonSuggestion) {
          return res.status(400).json({
            error: {
              message:
                "You are not allowed to delete a submitted chairperson suggestion",
            },
          });
        }
      }

      const chairpersonSuggestion = await prisma.chairpersonSuggestion.delete({
        where: {
          id,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
