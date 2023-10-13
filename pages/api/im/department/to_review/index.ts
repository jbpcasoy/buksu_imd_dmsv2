import prisma from "@/prisma/client";
import { ActiveFaculty, Faculty, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

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

      const { skip, take } = validator.cast(req.query);
      const iMs = await prisma.iM.findMany({
        skip,
        take,
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
                AND: [
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
                ],
              },
            },
          ],
        },
      });
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
              IMFile: {
                some: {
                  DepartmentReview: {
                    isNot: null,
                  },
                },
              },
            },
            // {
            //   IMFile: {
            //     every: {
            //       DepartmentReview: {
            //         CoordinatorReview: {
            //           CoordinatorSuggestion: {
            //             SubmittedCoordinatorSuggestion: {
            //               DepartmentReviewed: {
            //                 is: null,
            //               },
            //             },
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
            // {
            //   IMFile: {
            //     every: {
            //       DepartmentReview: {
            //         ChairpersonReview: {
            //           ChairpersonSuggestion: {
            //             SubmittedChairpersonSuggestion: {
            //               DepartmentReviewed: {
            //                 is: null,
            //               },
            //             },
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
            // {
            //   IMFile: {
            //     every: {
            //       DepartmentReview: {
            //         PeerReview: {
            //           PeerSuggestion: {
            //             SubmittedPeerSuggestion: {
            //               DepartmentReviewed: {
            //                 is: null,
            //               },
            //             },
            //           },
            //         },
            //       },
            //     },
            //   },
            // },
          ],
        },
      });

      return res.json({ iMs, count });
    } catch (error: any) {
      console.error(error);
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