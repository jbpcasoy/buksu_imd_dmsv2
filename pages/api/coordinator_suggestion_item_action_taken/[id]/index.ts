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

      const departmentRevision = await prisma.departmentRevision.findFirst({
        where: {
          IMFile: {
            DepartmentReview: {
              CoordinatorReview: {
                CoordinatorSuggestion: {
                  CoordinatorSuggestionItem: {
                    some: {
                      CoordinatorSuggestionItemActionTaken: {
                        id: {
                          equals: id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          OR: [
            {
              ReturnedDepartmentRevision: {
                is: null,
              },
            },
            {
              ReturnedDepartmentRevision: {
                SubmittedReturnedDepartmentRevision: {
                  is: null,
                },
              },
            },
          ],
        },
      });
      if (departmentRevision) {
        throw new Error("IM already revised.");
      }

      const coordinatorSuggestionItemActionTaken =
        await prisma.coordinatorSuggestionItemActionTaken.findFirstOrThrow({
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

      return res.json(coordinatorSuggestionItemActionTaken);
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
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      CoordinatorSuggestionItem: {
                        some: {
                          CoordinatorSuggestionItemActionTaken: {
                            id: {
                              equals: id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });

        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty can perform this action.",
            },
          });
        }

        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to delete this action taken",
            },
          });
        }

        const departmentRevision = await prisma.departmentRevision.findFirst({
          where: {
            DepartmentReviewed: {
              SubmittedCoordinatorSuggestion: {
                CoordinatorSuggestion: {
                  CoordinatorSuggestionItem: {
                    some: {
                      CoordinatorSuggestionItemActionTaken: {
                        id: {
                          equals: id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
        if (departmentRevision) {
          return res.status(400).json({
            error: {
              message: "IM is already revised",
            },
          });
        }
      }

      const coordinatorSuggestionItemActionTaken =
        await prisma.coordinatorSuggestionItemActionTaken.delete({
          where: {
            id,
          },
        });

      return res.json(coordinatorSuggestionItemActionTaken);
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
        value: Yup.string().required(),
      });

      await validator.validate(req.body);
      const { id } = req.query;
      const { value } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      CoordinatorSuggestionItem: {
                        some: {
                          CoordinatorSuggestionItemActionTaken: {
                            id: {
                              equals: id as string,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });

        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty can perform this action.",
            },
          });
        }

        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to update this action taken",
            },
          });
        }

        const departmentRevision = await prisma.departmentRevision.findFirst({
          where: {
            DepartmentReviewed: {
              SubmittedCoordinatorSuggestion: {
                CoordinatorSuggestion: {
                  CoordinatorSuggestionItem: {
                    some: {
                      CoordinatorSuggestionItemActionTaken: {
                        id: {
                          equals: id as string,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
        if (departmentRevision) {
          return res.status(400).json({
            error: {
              message: "IM is already revised",
            },
          });
        }
      }

      const coordinatorSuggestionItemActionTaken =
        await prisma.coordinatorSuggestionItemActionTaken.update({
          where: {
            id: id as string,
          },
          data: {
            value,
          },
        });

      return res.json(coordinatorSuggestionItemActionTaken);
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
