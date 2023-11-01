import prisma from "@/prisma/client";
import { ActiveFaculty, Faculty, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import iMAbility from "@/services/ability/iMAbility";
import { accessibleBy } from "@casl/prisma";
import { AppAbility } from "@/services/ability/abilityBuilder";

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
      let ability: AppAbility;
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
      ability = iMAbility({ user });

      const count = await prisma.iM.count({
        where: {
          AND: [
            accessibleBy(ability).IM,
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
              OR: [
                {
                  IMFile: {
                    some: {
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
                    some: {
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
                    some: {
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
              ],
            },
          ],
        },
      });

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