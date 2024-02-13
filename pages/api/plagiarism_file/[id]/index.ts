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
      const plagiarismFile = await prisma.plagiarismFile.findFirstOrThrow({
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

      return res.json(plagiarismFile);
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

      const plagiarismFileToDelete =
        await prisma.plagiarismFile.findFirstOrThrow({
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
                                                  IMFile: {
                                                    QAMISRevision: {
                                                      QAMISDeanEndorsement: {
                                                        QAMISDepartmentEndorsement:
                                                          {
                                                            ContentEditorReview:
                                                              {
                                                                ContentEditorSuggestion:
                                                                  {
                                                                    SubmittedContentEditorSuggestion:
                                                                      {
                                                                        IMERCCITLReviewed:
                                                                          {
                                                                            PlagiarismFile:
                                                                              {
                                                                                id: {
                                                                                  equals:
                                                                                    id as string,
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

        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to delete this plagiarism file",
            },
          });
        }

        const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
          where: {
            IMFile: {
              id: {
                equals: id as string,
              },
            },
          },
        });
        if (iMERCCITLRevision) {
          return res.status(403).json({
            error: {
              message: "Error: IMERC suggestions has already been revised",
            },
          });
        }
      }

      const plagiarismFile = await prisma.plagiarismFile.delete({
        where: {
          id: id as string,
        },
      });

      // const filePath = path.join(
      //   process.cwd(),
      //   `/files/plagiarism/${plagiarismFileToDelete.filename}`
      // );
      // fs.rm(filePath, (error) => {
      //   logger.error({ error });
      //   throw error;
      // });

      await del(
        `${process.env.BLOB_URL}/${process.env.NODE_ENV}/files/plagiarism/${plagiarismFileToDelete.filename}`
      );

      return res.json(plagiarismFile);
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
