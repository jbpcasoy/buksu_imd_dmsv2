import prisma from "@/prisma/client";
import { ActiveFaculty, Faculty, Prisma, User } from "@prisma/client";
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
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[title]": Yup.string().optional(),
        "filter[userName]": Yup.string().optional(),
        "filter[collegeName]": Yup.string().optional(),
        "filter[departmentName]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().oneOf(["asc", "desc"]).optional(),
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

      const {
        skip,
        take,
        "filter[collegeName]": filterCollegeName,
        "filter[departmentName]": filterDepartmentName,
        "filter[title]": filterTitle,
        "filter[userName]": filterUserName,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);

      const orderBy: Prisma.IMOrderByWithRelationInput =
        sortField === "title"
          ? {
              title: sortDirection,
            }
          : sortField === "createdAt"
          ? {
              createdAt: sortDirection,
            }
          : sortField === "userName"
          ? {
              Faculty: {
                User: {
                  name: sortDirection,
                },
              },
            }
          : sortField === "departmentName"
          ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
          : sortField === "collegeName"
          ? {
              Faculty: {
                Department: {
                  College: {
                    name: sortDirection,
                  },
                },
              },
            }
          : {
              createdAt: "desc",
            };

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
            {
              Faculty: {
                User: {
                  name: {
                    contains: filterUserName ?? "",
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              title: {
                contains: filterTitle ?? "",
                mode: "insensitive",
              },
            },
            {
              Faculty: {
                Department: {
                  name: {
                    contains: filterDepartmentName ?? "",
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  College: {
                    name: {
                      contains: filterCollegeName ?? "",
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
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
            {
              Faculty: {
                User: {
                  name: {
                    contains: filterUserName ?? "",
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              title: {
                contains: filterTitle ?? "",
                mode: "insensitive",
              },
            },
            {
              Faculty: {
                Department: {
                  name: {
                    contains: filterDepartmentName ?? "",
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  College: {
                    name: {
                      contains: filterCollegeName ?? "",
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy,
      });

      return res.json({ iMs, count });
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
