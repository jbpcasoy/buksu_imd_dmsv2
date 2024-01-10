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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedCITLRevisionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        actionTaken,
        returnedCITLRevisionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      if (!user.isAdmin) {
        const returnedCITLRevision =
          await prisma.returnedCITLRevision.findFirstOrThrow({
            where: {
              id: {
                equals: returnedCITLRevisionId,
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
              message:
                "Only an active IDD coordinator is allowed to perform this action",
            },
          });
        }

        if (iDDCoordinator.id !== returnedCITLRevision.iDDCoordinatorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this returned citl revision suggestion item",
            },
          });
        }

        const submittedReturnedCITLRevision =
          await prisma.submittedReturnedCITLRevision.findFirst({
            where: {
              ReturnedCITLRevision: {
                id: {
                  equals: returnedCITLRevisionId,
                },
              },
            },
          });

        if (submittedReturnedCITLRevision) {
          return res.status(400).json({
            error: {
              message: "Error: Peer suggestion is already submitted",
            },
          });
        }
      }

      const returnedCITLRevisionSuggestionItem =
        await prisma.returnedCITLRevisionSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ReturnedCITLRevision: {
              connect: {
                id: returnedCITLRevisionId,
              },
            },
          },
        });

      return res.json(returnedCITLRevisionSuggestionItem);
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
        "filter[returnedCITLRevisionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[returnedCITLRevisionId]": filterReturnedCITLRevisionId,
      } = validator.cast(req.query);
      const returnedCITLRevisionSuggestionItems =
        await prisma.returnedCITLRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                ReturnedCITLRevision: {
                  id: {
                    equals: filterReturnedCITLRevisionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedCITLRevisionSuggestionItem.count({
        where: {
          AND: [
            {
              ReturnedCITLRevision: {
                id: {
                  equals: filterReturnedCITLRevisionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ returnedCITLRevisionSuggestionItems, count });
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
