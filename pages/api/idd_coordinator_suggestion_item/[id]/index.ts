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

      const iDDCoordinatorSuggestionItem =
        await prisma.iDDCoordinatorSuggestionItem.findFirstOrThrow({
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

      return res.json(iDDCoordinatorSuggestionItem);
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
        const iDDCoordinatorSuggestion =
          await prisma.iDDCoordinatorSuggestion.findFirstOrThrow({
            where: {
              IDDCoordinatorSuggestionItem: {
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

        if (iDDCoordinatorSuggestion.iDDCoordinatorId !== iDDCoordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to delete this IDD coordinator suggestion item",
            },
          });
        }

        const submittedIDDCoordinatorSuggestion =
          await prisma.submittedIDDCoordinatorSuggestion.findFirst({
            where: {
              IDDCoordinatorSuggestion: {
                IDDCoordinatorSuggestionItem: {
                  some: {
                    id: {
                      equals: id,
                    },
                  },
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
      }

      const iDDCoordinatorSuggestionItem =
        await prisma.iDDCoordinatorSuggestionItem.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        pageNumber: Yup.number().min(0).optional(),
        suggestion: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });

      await validator.validate(req.body);

      const { id } = req.query;
      const { remarks, suggestion, pageNumber } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iDDCoordinatorSuggestion =
          await prisma.iDDCoordinatorSuggestion.findFirstOrThrow({
            where: {
              IDDCoordinatorSuggestionItem: {
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

        if (iDDCoordinatorSuggestion.iDDCoordinatorId !== iDDCoordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to update this IDD coordinator suggestion item",
            },
          });
        }

        const submittedIDDCoordinatorSuggestion =
          await prisma.submittedIDDCoordinatorSuggestion.findFirst({
            where: {
              IDDCoordinatorSuggestion: {
                IDDCoordinatorSuggestionItem: {
                  some: {
                    id: {
                      equals: id as string,
                    },
                  },
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
      }

      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.findFirst({
          where: {
            IDDCoordinatorSuggestion: {
              IDDCoordinatorSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
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
        await prisma.iDDCoordinatorSuggestionItem.update({
          where: {
            id: id as string,
          },
          data: {
            remarks,
            suggestion,
            pageNumber,
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
