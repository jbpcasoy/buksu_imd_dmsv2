import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
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
      const count = await iMERCToEndorseCount(user);

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

export async function iMERCToEndorseCount(user: User) {
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

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
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
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      is: null,
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
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
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
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
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISCoordinatorEndorsement: {
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
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
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
      ],
    },
  });
  return count;
}
