import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
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
      const iDDSpecialistSuggestion =
        await prisma.iDDSpecialistSuggestion.findFirstOrThrow({
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

      return res.json(iDDSpecialistSuggestion);
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
        const iDDSpecialistReview =
          await prisma.iDDSpecialistReview.findFirstOrThrow({
            where: {
              IDDSpecialistSuggestion: {
                id: {
                  equals: id,
                },
              },
            },
          });

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
              message: "Only an active IDD coordinator can perform this action",
            },
          });
        }

        if (iDDCoordinator.id !== iDDSpecialistReview.iDDCoordinatorId) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to delete this IDD Coordinator",
            },
          });
        }

        const submittedIDDSpecialistSuggestion =
          await prisma.submittedIDDSpecialistSuggestion.findFirst({
            where: {
              IDDSpecialistSuggestion: {
                id: {
                  equals: id,
                },
              },
            },
          });
          if(submittedIDDSpecialistSuggestion) {
            return res.status(403).json({
              error: {
                message: "Error: IDD Specialist is already submitted"
              }
            })
          }
      }

      const iDDSpecialistSuggestion =
        await prisma.iDDSpecialistSuggestion.delete({
          where: {
            id,
          },
        });

      return res.json(iDDSpecialistSuggestion);
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
