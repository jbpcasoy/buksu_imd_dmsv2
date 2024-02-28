import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { F013Props } from "@/types/forms";
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

      const coordinatorUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              Coordinator: {
                AND: [
                  {
                    ActiveCoordinator: {
                      isNot: null,
                    },
                  },
                  {
                    Faculty: {
                      Department: {
                        id: {
                          equals: department.id,
                        },
                      },
                    },
                  },
                ],
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
                AND: [
                  {
                    ActiveChairperson: {
                      isNot: null,
                    },
                  },
                  {
                    Faculty: {
                      Department: {
                        id: {
                          equals: department.id,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      });

      const peerUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              PeerReview: {
                some: {
                  PeerSuggestion: {
                    SubmittedPeerSuggestion: {
                      PeerSuggestion: {
                        PeerReview: {
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
      });

      const peerReview = await prisma.peerReview.findFirstOrThrow({
        where: {
          PeerSuggestion: {
            SubmittedPeerSuggestion: {
              PeerSuggestion: {
                PeerReview: {
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
      });
      const coordinatorReview = await prisma.coordinatorReview.findFirstOrThrow(
        {
          where: {
            CoordinatorSuggestion: {
              SubmittedCoordinatorSuggestion: {
                CoordinatorSuggestion: {
                  CoordinatorReview: {
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
        }
      );
      const chairpersonReview = await prisma.chairpersonReview.findFirstOrThrow(
        {
          where: {
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
        }
      );

      const ratingToNumber = (rating?: Rating | null) => {
        switch (rating) {
          case "NAA":
            return 1;
          case "NM":
            return 2;
          case "JE":
            return 3;
          case "M":
            return 4;
          case "VM":
            return 5;
          default:
            return 0;
        }
      };

      const numberToRating = (
        num: number
      ): "VM" | "M" | "JE" | "NM" | "NAA" => {
        switch (num) {
          case 1:
            return "NAA";
          case 2:
            return "NM";
          case 3:
            return "JE";
          case 4:
            return "M";
          case 5:
            return "VM";
          default:
            return "NAA";
        }
      };

      const ratings: ("VM" | "M" | "JE" | "NM" | "NAA")[][] = [
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q1_1) +
                ratingToNumber(chairpersonReview.q1_1) +
                ratingToNumber(coordinatorReview.q1_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q1_2) +
                ratingToNumber(chairpersonReview.q1_2) +
                ratingToNumber(coordinatorReview.q1_2)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q2_1) +
                ratingToNumber(chairpersonReview.q2_1) +
                ratingToNumber(coordinatorReview.q2_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q2_2) +
                ratingToNumber(chairpersonReview.q2_2) +
                ratingToNumber(coordinatorReview.q2_2)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q2_3) +
                ratingToNumber(chairpersonReview.q2_3) +
                ratingToNumber(coordinatorReview.q2_3)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q2_4) +
                ratingToNumber(chairpersonReview.q2_4) +
                ratingToNumber(coordinatorReview.q2_4)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q3_1) +
                ratingToNumber(chairpersonReview.q3_1) +
                ratingToNumber(coordinatorReview.q3_1)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q4_1) +
                ratingToNumber(chairpersonReview.q4_1) +
                ratingToNumber(coordinatorReview.q4_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q4_2) +
                ratingToNumber(chairpersonReview.q4_2) +
                ratingToNumber(coordinatorReview.q4_2)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q4_3) +
                ratingToNumber(chairpersonReview.q4_3) +
                ratingToNumber(coordinatorReview.q4_3)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q5_1) +
                ratingToNumber(chairpersonReview.q5_1) +
                ratingToNumber(coordinatorReview.q5_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q5_2) +
                ratingToNumber(chairpersonReview.q5_2) +
                ratingToNumber(coordinatorReview.q5_2)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q5_3) +
                ratingToNumber(chairpersonReview.q5_3) +
                ratingToNumber(coordinatorReview.q5_3)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q6_1) +
                ratingToNumber(chairpersonReview.q6_1) +
                ratingToNumber(coordinatorReview.q6_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q6_2) +
                ratingToNumber(chairpersonReview.q6_2) +
                ratingToNumber(coordinatorReview.q6_2)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q6_3) +
                ratingToNumber(chairpersonReview.q6_3) +
                ratingToNumber(coordinatorReview.q6_3)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q6_4) +
                ratingToNumber(chairpersonReview.q6_4) +
                ratingToNumber(coordinatorReview.q6_4)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q6_5) +
                ratingToNumber(chairpersonReview.q6_5) +
                ratingToNumber(coordinatorReview.q6_5)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q7_1) +
                ratingToNumber(chairpersonReview.q7_1) +
                ratingToNumber(coordinatorReview.q7_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q7_2) +
                ratingToNumber(chairpersonReview.q7_2) +
                ratingToNumber(coordinatorReview.q7_2)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q7_3) +
                ratingToNumber(chairpersonReview.q7_3) +
                ratingToNumber(coordinatorReview.q7_3)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q7_4) +
                ratingToNumber(chairpersonReview.q7_4) +
                ratingToNumber(coordinatorReview.q7_4)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q7_5) +
                ratingToNumber(chairpersonReview.q7_5) +
                ratingToNumber(coordinatorReview.q7_5)) /
                3
            )
          ),
        ],
        [
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q8_1) +
                ratingToNumber(chairpersonReview.q8_1) +
                ratingToNumber(coordinatorReview.q8_1)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q8_2) +
                ratingToNumber(chairpersonReview.q8_2) +
                ratingToNumber(coordinatorReview.q8_2)) /
                3
            )
          ),
          numberToRating(
            Math.round(
              (ratingToNumber(peerReview.q8_3) +
                ratingToNumber(chairpersonReview.q8_3) +
                ratingToNumber(coordinatorReview.q8_3)) /
                3
            )
          ),
        ],
      ];

      const response: F013Props = {
        iMTitle: iM?.title,
        authorNames: authorNames.join(", "),
        iMType: iMTypeMap[iM.type] as
          | "Module"
          | "Course File"
          | "Worktext"
          | "Textbook",
        coordinatorName: coordinatorUser.name ?? "",
        chairpersonName: chairpersonUser.name ?? "",
        seniorFacultyName: peerUser.name ?? "",
        ratings,
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
