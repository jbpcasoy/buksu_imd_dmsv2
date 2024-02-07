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
        iDDSpecialistReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { iDDSpecialistReviewId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iDDSpecialistReview =
          await prisma.iDDSpecialistReview.findFirstOrThrow({
            where: {
              id: {
                equals: iDDSpecialistReviewId,
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
              message: "Only an active idd coordinator can perform this action",
            },
          });
        }

        if (iDDSpecialistReview.iDDCoordinatorId !== iDDCoordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this IDD specialist suggestion",
            },
          });
        }
      }

      const iDDSpecialistSuggestion =
        await prisma.iDDSpecialistSuggestion.create({
          data: {
            IDDSpecialistReview: {
              connect: {
                id: iDDSpecialistReviewId,
              },
            },
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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);

      const iDDSpecialistSuggestions =
        await prisma.iDDSpecialistSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDSpecialistSuggestion.count({
        where: {},
      });

      return res.json({ iDDSpecialistSuggestions, count });
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
