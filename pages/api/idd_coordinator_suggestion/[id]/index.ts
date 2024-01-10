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

      const iDDCoordinatorSuggestion =
        await prisma.iDDCoordinatorSuggestion.findFirstOrThrow({
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

      return res.json(iDDCoordinatorSuggestion);
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
        const iDDCoordinator = await prisma.iDDCoordinator.findFirst({
          where: {
            ActiveIDDCoordinator: {
              IDDCoordinator: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });
        if (!iDDCoordinator) {
          return res.status(403).json({
            error: {
              message:
                "Only an active IDD coordinator is allowed to perform this action",
            },
          });
        }

        const iDDCoordinatorSuggestion =
          await prisma.iDDCoordinatorSuggestion.findFirstOrThrow({
            where: {
              id: {
                equals: id,
              },
            },
          });
        if (iDDCoordinator.id !== iDDCoordinatorSuggestion.iDDCoordinatorId) {
          return res.status(400).json({
            error: {
              message:
                "You are not allowed to delete this IDD coordinator suggestion",
            },
          });
        }

        const submittedIDDCoordinatorSuggestion =
          await prisma.submittedIDDCoordinatorSuggestion.findFirst({
            where: {
              IDDCoordinatorSuggestion: {
                id: {
                  equals: id,
                },
              },
            },
          });
        if (submittedIDDCoordinatorSuggestion) {
          return res.status(400).json({
            error: {
              message:
                "You are not allowed to delete a submitted idd coordinator",
            },
          });
        }
      }

      const iDDCoordinatorSuggestion =
        await prisma.iDDCoordinatorSuggestion.delete({
          where: {
            id,
          },
        });

      return res.json(iDDCoordinatorSuggestion);
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
