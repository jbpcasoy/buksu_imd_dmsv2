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
        returnedIMERCCITLRevisionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const { returnedIMERCCITLRevisionId, remarks, suggestion, pageNumber } =
        validator.cast(req.body);

      if (!user.isAdmin) {
        const returnedIMERCCITLRevision =
          await prisma.returnedIMERCCITLRevision.findFirstOrThrow({
            where: {
              id: {
                equals: returnedIMERCCITLRevisionId,
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

        if (iDDCoordinator.id !== returnedIMERCCITLRevision.iDDCoordinatorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this returned IMERC CITL revision suggestion item",
            },
          });
        }

        const submittedReturnedIMERCCITLRevision =
          await prisma.submittedReturnedIMERCCITLRevision.findFirst({
            where: {
              ReturnedIMERCCITLRevision: {
                id: {
                  equals: returnedIMERCCITLRevisionId,
                },
              },
            },
          });

        if (submittedReturnedIMERCCITLRevision) {
          return res.status(400).json({
            error: {
              message: "Error: Peer suggestion is already submitted",
            },
          });
        }
      }

      const returnedIMERCCITLRevisionSuggestionItem =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.create({
          data: {
            remarks,
            suggestion,
            pageNumber,
            ReturnedIMERCCITLRevision: {
              connect: {
                id: returnedIMERCCITLRevisionId,
              },
            },
          },
        });

      return res.json(returnedIMERCCITLRevisionSuggestionItem);
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
        "filter[returnedIMERCCITLRevisionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[returnedIMERCCITLRevisionId]":
          filterReturnedIMERCCITLRevisionId,
      } = validator.cast(req.query);
      const returnedIMERCCITLRevisionSuggestionItems =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                ReturnedIMERCCITLRevision: {
                  id: {
                    equals: filterReturnedIMERCCITLRevisionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedIMERCCITLRevisionSuggestionItem.count({
        where: {
          AND: [
            {
              ReturnedIMERCCITLRevision: {
                id: {
                  equals: filterReturnedIMERCCITLRevisionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ returnedIMERCCITLRevisionSuggestionItems, count });
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
