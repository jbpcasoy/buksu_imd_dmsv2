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
      const count = await iMERCCITLDirectorEndorsedCount(user);

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

export async function iMERCCITLDirectorEndorsedCount(user: User) {
  let ability: AppAbility;
  ability = iMAbility({ user });

  const count = await prisma.iM.count({
    where: {
      AND: [
        accessibleBy(ability).IM,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
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
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
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
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                returned: {
                                  equals: false,
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
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                returned: {
                                  equals: false,
                                },
                                IMERCIDDCoordinatorEndorsement: {
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
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                returned: {
                                  equals: false,
                                },
                                IMERCIDDCoordinatorEndorsement: {
                                  IMERCCITLDirectorEndorsement: {
                                    CITLDirector: {
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
              },
            },
          },
        },
      ],
    },
  });
  return count;
}