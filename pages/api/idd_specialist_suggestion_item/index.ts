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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDSpecialistSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        actionTaken,
        iDDSpecialistSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iDDSpecialistReview =
          await prisma.iDDSpecialistReview.findFirstOrThrow({
            where: {
              IDDSpecialistSuggestion: {
                id: {
                  equals: iDDSpecialistSuggestionId,
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
              message: "Only an active IDD Coordinator can perform this action",
            },
          });
        }

        if (iDDCoordinator.id !== iDDSpecialistReview.iDDCoordinatorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this IDD specialist suggestion item",
            },
          });
        }

        const submittedIDDSpecialistSuggestion =
          await prisma.submittedIDDSpecialistSuggestion.findFirst({
            where: {
              IDDSpecialistSuggestion: {
                id: {
                  equals: iDDSpecialistSuggestionId,
                },
              },
            },
          });

        if (submittedIDDSpecialistSuggestion) {
          return res.status(400).json({
            error: {
              message: "Error: IDD specialist suggestion is already submitted",
            },
          });
        }
      }

      const iDDSpecialistSuggestionItem =
        await prisma.iDDSpecialistSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            IDDSpecialistSuggestion: {
              connect: {
                id: iDDSpecialistSuggestionId,
              },
            },
          },
        });

      return res.json(iDDSpecialistSuggestionItem);
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
        "filter[iDDSpecialistSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[iDDSpecialistSuggestionId]": filterIDDSpecialistSuggestionId,
      } = validator.cast(req.query);
      const iDDSpecialistSuggestionItems =
        await prisma.iDDSpecialistSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                IDDSpecialistSuggestion: {
                  id: {
                    equals: filterIDDSpecialistSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDSpecialistSuggestionItem.count({
        where: {
          AND: [
            {
              IDDSpecialistSuggestion: {
                id: {
                  equals: filterIDDSpecialistSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ iDDSpecialistSuggestionItems, count });
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
