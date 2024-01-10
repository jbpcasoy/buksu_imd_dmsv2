import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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
        iDDCoordinatorSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        actionTaken,
        iDDCoordinatorSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

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
                equals: iDDCoordinatorSuggestionId,
              },
            },
          });
        if (iDDCoordinatorSuggestion.iDDCoordinatorId !== iDDCoordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this IDD coordinator suggestion item",
            },
          });
        }
      }

      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.findFirst({
          where: {
            IDDCoordinatorSuggestion: {
              id: {
                equals: iDDCoordinatorSuggestionId,
              },
            },
          },
        });

      if (submittedIDDCoordinatorSuggestion) {
        return res.status(400).json({
          error: {
            message: "Error: IDD coordinator suggestion is already submitted",
          },
        });
      }

      const iDDCoordinatorSuggestionItem =
        await prisma.iDDCoordinatorSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            IDDCoordinatorSuggestion: {
              connect: {
                id: iDDCoordinatorSuggestionId,
              },
            },
          },
        });

      return res.json(iDDCoordinatorSuggestionItem);
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
        "filter[iDDCoordinatorSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[iDDCoordinatorSuggestionId]": filterIDDCoordinatorSuggestionId,
      } = validator.cast(req.query);
      const iDDCoordinatorSuggestionItems =
        await prisma.iDDCoordinatorSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                IDDCoordinatorSuggestion: {
                  id: {
                    equals: filterIDDCoordinatorSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDCoordinatorSuggestionItem.count({
        where: {
          AND: [
            {
              IDDCoordinatorSuggestion: {
                id: {
                  equals: filterIDDCoordinatorSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ iDDCoordinatorSuggestionItems, count });
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
