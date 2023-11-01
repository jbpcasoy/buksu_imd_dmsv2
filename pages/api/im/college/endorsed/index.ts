import prisma from "@/prisma/client";
import { ActiveFaculty, Faculty, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import iMAbility from "@/services/ability/iMAbility";
import { accessibleBy } from "@casl/prisma";
import { AppAbility } from "@/services/ability/abilityBuilder";
import useActiveDean from "@/hooks/useActiveDean";

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
      const userActiveDean = await prisma.activeDean.findFirstOrThrow({
        where: {
          Dean: {
            Faculty: {
              ActiveFaculty: {
                id: {
                  equals: userActiveFaculty.id,
                },
              },
            },
          },
        },
        include: {
          Dean: {
            include: {
              Faculty: {
                include: {
                  Department: {
                    include: {
                      College: true,
                    },
                  },
                },
              },
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
                  College: {
                    id: userActiveDean.Dean.Faculty.Department.College.id,
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
              IMFile: {
                some: {
                  DepartmentRevision: {
                    isNot: null,
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
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
                some: {
                  DepartmentRevision: {
                    CoordinatorEndorsement: {
                      DeanEndorsement: {
                        Dean: {
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
                  College: {
                    id: userActiveDean.Dean.Faculty.Department.College.id,
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentRevision: {
                    isNot: null,
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentRevision: {
                    isNot: null,
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
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
                some: {
                  DepartmentRevision: {
                    CoordinatorEndorsement: {
                      DeanEndorsement: {
                        Dean: {
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
          ],
        },
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
