import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { F011Props } from "@/types/forms";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

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
    const iMTypeMap = {
      MODULE: "Module",
      COURSE_FILE: "Course File",
      WORKTEXT: "Worktext",
      TEXTBOOK: "Textbook",
    };

    const { id } = req.query;

    try {
      const iM = await prisma.iM.findUniqueOrThrow({
        where: {
          id: id as string,
        },
      });

      const iMAuthor = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              IM: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        },
      });

      const coAuthors = await prisma.coAuthor.findMany({
        where: {
          IM: {
            id: {
              equals: id as string,
            },
          },
        },
      });
      const authorNames: string[] = [];
      authorNames.push(iMAuthor?.name ?? "");
      for (let coAuthor of coAuthors) {
        const coAuthorUser = await prisma.user.findFirstOrThrow({
          where: {
            Faculty: {
              some: {
                id: {
                  equals: coAuthor.facultyId,
                },
              },
            },
          },
        });

        if (coAuthorUser?.name) {
          authorNames.push(coAuthorUser?.name);
        }
      }

      const department = await prisma.department.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              IM: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        },
      });

      const college = await prisma.college.findFirstOrThrow({
        where: {
          Department: {
            some: {
              id: {
                equals: department.id,
              },
            },
          },
        },
      });

      const coordinatorUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              Coordinator: {
                CoordinatorEndorsement: {
                  some: {
                    DepartmentRevision: {
                      IMFile: {
                        IM: {
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

      const chairpersonUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              Chairperson: {
                ChairpersonReview: {
                  some: {
                    ChairpersonSuggestion: {
                      SubmittedChairpersonSuggestion: {
                        ChairpersonSuggestion: {
                          ChairpersonReview: {
                            DepartmentReview: {
                              IMFile: {
                                IM: {
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
      });

      const deanUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              Dean: {
                DeanEndorsement: {
                  some: {
                    CoordinatorEndorsement: {
                      DepartmentRevision: {
                        IMFile: {
                          IM: {
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
      });

      const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
        where: {
          IDDCoordinator: {
            IDDCoordinatorEndorsement: {
              some: {
                CITLRevision: {
                  IMFile: {
                    IM: {
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
      const response: F011Props = {
        iMTitle: iM?.title,
        authorName: iMAuthor.name ?? "",
        iMType: iMTypeMap[iM.type] as
          | "Module"
          | "Course File"
          | "Worktext"
          | "Textbook",
        coordinatorName: coordinatorUser.name ?? "",
        iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
        chairpersonName: chairpersonUser.name ?? "",
        deanName: deanUser.name ?? "",
      };

      return res.json(response);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
