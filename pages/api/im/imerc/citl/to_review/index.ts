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
      const count = await prisma.iM.count({
        where: {
          AND: [
            accessibleBy(ability).IM,
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
