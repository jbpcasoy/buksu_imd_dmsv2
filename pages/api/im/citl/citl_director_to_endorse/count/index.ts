import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
    try {
      const count = await cITLDirectorToEndorseCount(user);

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

export async function cITLDirectorToEndorseCount(user: User) {
  let ability: AppAbility;

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
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
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
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
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                CITLDirectorEndorsement: {
                                  isNot: null,
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
      ],
    },
  });
  return count;
}
