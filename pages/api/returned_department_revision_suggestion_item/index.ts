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
        returnedDepartmentRevisionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const {
        returnedDepartmentRevisionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      if (!user.isAdmin) {
        const coordinator = await prisma.coordinator.findFirst({
          where: {
            ActiveCoordinator: {
              Coordinator: {
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

        const returnedDepartmentRevision =
          await prisma.returnedDepartmentRevision.findFirstOrThrow({
            where: {
              id: {
                equals: returnedDepartmentRevisionId,
              },
            },
          });
        if (!coordinator) {
          return res.status(403).json({
            error: {
              message: "Only an active coordinator can perform this action",
            },
          });
        }

        if (returnedDepartmentRevision.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create this returned department revision suggestion item",
            },
          });
        }

        const submittedReturnedDepartmentRevision =
          await prisma.submittedReturnedDepartmentRevision.findFirst({
            where: {
              ReturnedDepartmentRevision: {
                id: {
                  equals: returnedDepartmentRevisionId,
                },
              },
            },
          });

        if (submittedReturnedDepartmentRevision) {
          return res.status(400).json({
            error: {
              message: "Error: Returned department suggestion is already submitted",
            },
          });
        }
      }

      const returnedDepartmentRevisionSuggestionItem =
        await prisma.returnedDepartmentRevisionSuggestionItem.create({
          data: {
            remarks,
            suggestion,
            pageNumber,
            ReturnedDepartmentRevision: {
              connect: {
                id: returnedDepartmentRevisionId,
              },
            },
          },
        });

      return res.json(returnedDepartmentRevisionSuggestionItem);
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
        "filter[returnedDepartmentRevisionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[returnedDepartmentRevisionId]":
          filterReturnedDepartmentRevisionId,
      } = validator.cast(req.query);
      const returnedDepartmentRevisionSuggestionItems =
        await prisma.returnedDepartmentRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              {
                ReturnedDepartmentRevision: {
                  id: {
                    equals: filterReturnedDepartmentRevisionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedDepartmentRevisionSuggestionItem.count(
        {
          where: {
            AND: [
              {
                ReturnedDepartmentRevision: {
                  id: {
                    equals: filterReturnedDepartmentRevisionId,
                  },
                },
              },
            ],
          },
        }
      );

      return res.json({ returnedDepartmentRevisionSuggestionItems, count });
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
