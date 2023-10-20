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
                id: {
                  equals: userActiveFaculty.facultyId,
                },
              },
            },
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
              NOT: {
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
                id: {
                  equals: userActiveFaculty.facultyId,
                },
              },
            },
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
              NOT: {
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
              },
            },
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