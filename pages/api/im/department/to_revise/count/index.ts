import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ActiveFaculty, User } from "@prisma/client";
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
    try {
      const count = await toReviseCount(user);

      return res.json({ count });
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

export async function toReviseCount(user: User) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                CoordinatorReview: {
                  CoordinatorSuggestion: {
                    SubmittedCoordinatorSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                ChairpersonReview: {
                  ChairpersonSuggestion: {
                    SubmittedChairpersonSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                PeerReview: {
                  PeerSuggestion: {
                    SubmittedPeerSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
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
            },
          },
        },
      ],
    },
  });
  return count;
}
