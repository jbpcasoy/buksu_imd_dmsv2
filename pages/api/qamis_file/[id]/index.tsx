import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { del } from "@vercel/blob";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

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
      const { id } = req.query;
      const qAMISFile = await prisma.qAMISFile.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      return res.json(qAMISFile);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const { id } = req.query;

      const qAMISFileToDelete = await prisma.qAMISFile.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        DepartmentReviewed: {
                          DepartmentRevision: {
                            some: {
                              CoordinatorEndorsement: {
                                DeanEndorsement: {
                                  IDDCoordinatorSuggestion: {
                                    SubmittedIDDCoordinatorSuggestion: {
                                      CITLRevision: {
                                        some: {
                                          IDDCoordinatorEndorsement: {
                                            CITLDirectorEndorsement: {
                                              QAMISSuggestion: {
                                                SubmittedQAMISSuggestion: {
                                                  QAMISFile: {
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
              message: "Only an active faculty can perform this action",
            },
          });
        }

        if (faculty.id !== iM.facultyId) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to delete this QAMIS file",
            },
          });
        }

        const qAMISRevision = await prisma.qAMISRevision.findFirst({
          where: {
            IMFile: {
              id: {
                equals: id as string,
              },
            },
          },
        });
        if (qAMISRevision) {
          return res.status(403).json({
            error: {
              message: "Error: QAMIS suggestions has already been revised",
            },
          });
        }
      }

      const qAMISFile = await prisma.qAMISFile.delete({
        where: {
          id: id as string,
        },
      });

      // const filePath = path.join(
      //   process.cwd(),
      //   `/files/qamis/${qAMISFileToDelete.filename}`
      // );
      // fs.rm(filePath, (error) => {
      //   logger.error({ error });
      //   throw error;
      // });

      await del(
        `${process.env.BLOB_URL}/${process.env.NODE_ENV}/files/qamis/${qAMISFileToDelete.filename}`
      );

      return res.json(qAMISFile);
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
