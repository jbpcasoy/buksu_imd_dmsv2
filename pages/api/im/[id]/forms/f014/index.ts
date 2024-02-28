import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { F014Props } from "@/types/forms";
import { Rating, User } from "@prisma/client";
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

      const contentEditorReview =
        await prisma.contentEditorReview.findFirstOrThrow({
          where: {
            ContentEditorSuggestion: {
              SubmittedContentEditorSuggestion: {
                ContentEditorSuggestion: {
                  ContentEditorReview: {
                    QAMISDepartmentEndorsement: {
                      QAMISDeanEndorsement: {
                        QAMISRevision: {
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
      const cITLDirectorUser = await prisma.user.findFirstOrThrow({
        where: {
          CITLDirector: {
            id: contentEditorReview.cITLDirectorId,
          },
        },
      });
      const contentEditorRatings = [
        [contentEditorReview.q1_1, contentEditorReview.q1_2],
        [
          contentEditorReview.q2_1,
          contentEditorReview.q2_2,
          contentEditorReview.q2_3,
          contentEditorReview.q2_4,
        ],
        [contentEditorReview.q3_1],
        [
          contentEditorReview.q4_1,
          contentEditorReview.q4_2,
          contentEditorReview.q4_3,
        ],
        [
          contentEditorReview.q5_1,
          contentEditorReview.q5_2,
          contentEditorReview.q5_3,
          contentEditorReview.q5_4,
        ],
        [
          contentEditorReview.q6_1,
          contentEditorReview.q6_2,
          contentEditorReview.q6_3,
          contentEditorReview.q6_4,
          contentEditorReview.q6_5,
        ],
        [
          contentEditorReview.q7_1,
          contentEditorReview.q7_2,
          contentEditorReview.q7_3,
          contentEditorReview.q7_4,
          contentEditorReview.q7_5,
        ],
        [
          contentEditorReview.q8_1,
          contentEditorReview.q8_2,
          contentEditorReview.q8_3,
        ],
      ];

      const iDDSpecialistReview =
        await prisma.iDDSpecialistReview.findFirstOrThrow({
          where: {
            IDDSpecialistSuggestion: {
              SubmittedIDDSpecialistSuggestion: {
                IDDSpecialistSuggestion: {
                  IDDSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      QAMISDeanEndorsement: {
                        QAMISRevision: {
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
      const iDDCoordinator = await prisma.user.findFirstOrThrow({
        where: {
          IDDCoordinator: {
            id: {
              equals: iDDSpecialistReview.iDDCoordinatorId,
            },
          },
        },
      });
      const iDDSpecialistRatings = [
        [iDDSpecialistReview.q1_1, iDDSpecialistReview.q1_2],
        [
          iDDSpecialistReview.q2_1,
          iDDSpecialistReview.q2_2,
          iDDSpecialistReview.q2_3,
          iDDSpecialistReview.q2_4,
        ],
        [iDDSpecialistReview.q3_1],
        [
          iDDSpecialistReview.q4_1,
          iDDSpecialistReview.q4_2,
          iDDSpecialistReview.q4_3,
        ],
        [
          iDDSpecialistReview.q5_1,
          iDDSpecialistReview.q5_2,
          iDDSpecialistReview.q5_3,
          iDDSpecialistReview.q5_4,
        ],
        [
          iDDSpecialistReview.q6_1,
          iDDSpecialistReview.q6_2,
          iDDSpecialistReview.q6_3,
          iDDSpecialistReview.q6_4,
          iDDSpecialistReview.q6_5,
        ],
        [
          iDDSpecialistReview.q7_1,
          iDDSpecialistReview.q7_2,
          iDDSpecialistReview.q7_3,
          iDDSpecialistReview.q7_4,
          iDDSpecialistReview.q7_5,
        ],
        [
          iDDSpecialistReview.q8_1,
          iDDSpecialistReview.q8_2,
          iDDSpecialistReview.q8_3,
        ],
      ];

      const contentSpecialistReview =
        await prisma.contentSpecialistReview.findFirstOrThrow({
          where: {
            ContentSpecialistSuggestion: {
              SubmittedContentSpecialistSuggestion: {
                ContentSpecialistSuggestion: {
                  ContentSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      QAMISDeanEndorsement: {
                        QAMISRevision: {
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
      const contentSpecialistUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              ContentSpecialist: {
                id: {
                  equals: contentSpecialistReview.contentSpecialistId,
                },
              },
            },
          },
        },
      });
      const contentSpecialistRatings = [
        [contentSpecialistReview.q1_1, contentSpecialistReview.q1_2],
        [
          contentSpecialistReview.q2_1,
          contentSpecialistReview.q2_2,
          contentSpecialistReview.q2_3,
          contentSpecialistReview.q2_4,
        ],
        [contentSpecialistReview.q3_1],
        [
          contentSpecialistReview.q4_1,
          contentSpecialistReview.q4_2,
          contentSpecialistReview.q4_3,
        ],
        [
          contentSpecialistReview.q5_1,
          contentSpecialistReview.q5_2,
          contentSpecialistReview.q5_3,
          contentSpecialistReview.q5_4,
        ],
        [
          contentSpecialistReview.q6_1,
          contentSpecialistReview.q6_2,
          contentSpecialistReview.q6_3,
          contentSpecialistReview.q6_4,
          contentSpecialistReview.q6_5,
        ],
        [
          contentSpecialistReview.q7_1,
          contentSpecialistReview.q7_2,
          contentSpecialistReview.q7_3,
          contentSpecialistReview.q7_4,
          contentSpecialistReview.q7_5,
        ],
        [
          contentSpecialistReview.q8_1,
          contentSpecialistReview.q8_2,
          contentSpecialistReview.q8_3,
        ],
      ];

      const response: F014Props = {
        iMTitle: iM?.title,
        authorNames: authorNames.join(", "),
        iMType: iMTypeMap[iM.type] as
          | "Module"
          | "Course File"
          | "Worktext"
          | "Textbook",
        cITLDirectorName: cITLDirectorUser.name ?? "",
        contentEditorRatings,
        contentSpecialistName: contentSpecialistUser.name ?? "",
        contentSpecialistRatings,
        iDDCoordinatorName: iDDCoordinator.name ?? "",
        iDDSpecialistRatings,
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
