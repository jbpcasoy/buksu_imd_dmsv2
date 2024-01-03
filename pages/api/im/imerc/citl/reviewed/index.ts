import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import iMStatusQueryBuilder from "@/services/iMStatusQueryBuilder";
import logger from "@/services/logger";
import { Prisma, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

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
        "filter[status]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().oneOf(["asc", "desc"]).optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[collegeName]": filterCollegeName,
        "filter[departmentName]": filterDepartmentName,
        "filter[title]": filterTitle,
        "filter[userName]": filterUserName,
        "filter[status]": filterStatus,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);
      const statusQuery = iMStatusQueryBuilder(filterStatus);

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
            statusQuery,
            {
              OR: [
                {
                  IMFile: {
                    some: {
                      QAMISRevision: {
                        QAMISChairpersonEndorsement: {
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
                  IMFile: {
                    some: {
                      QAMISRevision: {
                        QAMISChairpersonEndorsement: {
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
      const count = await prisma.iM.count({
        where: {
          AND: [
            statusQuery,
            {
              OR: [
                {
                  IMFile: {
                    some: {
                      QAMISRevision: {
                        QAMISChairpersonEndorsement: {
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
                  IMFile: {
                    some: {
                      QAMISRevision: {
                        QAMISChairpersonEndorsement: {
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
