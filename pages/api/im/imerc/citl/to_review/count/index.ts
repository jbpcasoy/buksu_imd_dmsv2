import prisma from "@/prisma/client";
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
      const count = await iMERCCITLToReviewCount(user);

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

export async function iMERCCITLToReviewCount(user: User) {
  const count = await prisma.iM.count({
    where: {
      AND: [
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
          OR: [
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          ContentEditorReview: {
                            ContentEditorSuggestion: {
                              SubmittedContentEditorSuggestion: {
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
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          IDDSpecialistReview: {
                            IDDSpecialistSuggestion: {
                              SubmittedIDDSpecialistSuggestion: {
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
          ],
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
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
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    IDDSpecialistReview: {
                      IDDSpecialistSuggestion: {
                        SubmittedIDDSpecialistSuggestion: {
                          IDDSpecialistSuggestion: {
                            IDDSpecialistReview: {
                              IDDCoordinator: {
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
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentEditorReview: {
                      ContentEditorSuggestion: {
                        SubmittedContentEditorSuggestion: {
                          ContentEditorSuggestion: {
                            ContentEditorReview: {
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
      ],
    },
  });
  return count;
}
