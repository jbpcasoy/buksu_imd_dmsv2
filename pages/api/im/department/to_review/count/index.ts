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
      const count = await toReviewCount(user);

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

export async function toReviewCount(user: User) {
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
  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          id: userActiveFaculty.facultyId,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          OR: [
            {
              AND: [
                {
                  CoAuthor: {
                    none: {
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
                {
                  Faculty: {
                    Department: {
                      Faculty: {
                        none: {
                          Chairperson: {
                            ActiveChairperson: {
                              Chairperson: {
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
                        },
                      },
                    },
                  },
                },
                {
                  Faculty: {
                    Department: {
                      Faculty: {
                        none: {
                          Coordinator: {
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
                        },
                      },
                    },
                  },
                },
              ],
            },
            {
              OR: [
                {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Chairperson: {
                            ActiveChairperson: {
                              Chairperson: {
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
                        },
                      },
                    },
                  },
                },
                {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Coordinator: {
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
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
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
        {
          NOT: {
            AND: [
              {
                Faculty: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
              {
                Faculty: {
                  OR: [
                    {
                      ActiveFaculty: {
                        is: null,
                      },
                    },
                    {
                      Chairperson: {
                        is: null,
                      },
                    },
                    {
                      Chairperson: {
                        ActiveChairperson: {
                          is: null,
                        },
                      },
                    },
                    {
                      Coordinator: {
                        is: null,
                      },
                    },
                    {
                      Coordinator: {
                        ActiveCoordinator: {
                          is: null,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          IMFile: {
            none: {
              DepartmentReview: {
                ChairpersonReview: {
                  ChairpersonSuggestion: {
                    SubmittedChairpersonSuggestion: {
                      ChairpersonSuggestion: {
                        ChairpersonReview: {
                          Chairperson: {
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
              DepartmentReview: {
                CoordinatorReview: {
                  CoordinatorSuggestion: {
                    SubmittedCoordinatorSuggestion: {
                      CoordinatorSuggestion: {
                        CoordinatorReview: {
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
              DepartmentReview: {
                PeerReview: {
                  PeerSuggestion: {
                    SubmittedPeerSuggestion: {
                      PeerSuggestion: {
                        PeerReview: {
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
                isNot: null,
              },
            },
          },
        },
        {
          AND: [
            {
              IMFile: {
                none: {
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
                none: {
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
                none: {
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
          ],
        },
      ],
    },
  });
  return count;
}
