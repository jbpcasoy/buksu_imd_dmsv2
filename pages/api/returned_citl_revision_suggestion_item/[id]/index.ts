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
      const returnedCITLRevisionSuggestionItem =
        await prisma.returnedCITLRevisionSuggestionItem.findFirstOrThrow({
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

      return res.json(returnedCITLRevisionSuggestionItem);
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
        const returnedCITLRevision =
          await prisma.returnedCITLRevision.findFirst({
            where: {
              ReturnedCITLRevisionSuggestionItem: {
                some: {
                  id: {
                    equals: id,
                  },
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
              message:
                "Only an active IDD coordinator is allowed to perform this action",
            },
          });
        }

        if (returnedCITLRevision?.iDDCoordinatorId !== iDDCoordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this returned CITL revision suggestion item",
            },
          });
        }

        const submittedReturnedCITLRevision =
          await prisma.submittedReturnedCITLRevision.findFirst({
            where: {
              ReturnedCITLRevision: {
                ReturnedCITLRevisionSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
        await prisma.returnedCITLRevisionSuggestionItem.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        actionTaken: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
      });

      await validator.validate(req.body);

      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

      if (!user.isAdmin) {
        const returnedCITLRevision =
          await prisma.returnedCITLRevision.findFirst({
            where: {
              ReturnedCITLRevisionSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
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
              message:
                "Only an active IDD coordinator is allowed to perform this action",
            },
          });
        }

        if (returnedCITLRevision?.iDDCoordinatorId !== iDDCoordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this returned CITL revision suggestion item",
            },
          });
        }

        const submittedReturnedCITLRevision =
          await prisma.submittedReturnedCITLRevision.findFirst({
            where: {
              ReturnedCITLRevision: {
                ReturnedCITLRevisionSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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

      const submittedReturnedCITLRevision =
        await prisma.submittedReturnedCITLRevision.findFirst({
          where: {
            ReturnedCITLRevision: {
              ReturnedCITLRevisionSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
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

      const returnedCITLRevisionSuggestionItem =
        await prisma.returnedCITLRevisionSuggestionItem.update({
          where: {
            id: id as string,
          },
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
