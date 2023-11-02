import prisma from "@/prisma/client";
import facultyAbility from "@/services/ability/facultyAbility";
import iMAbility from "@/services/ability/iMAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { ActiveFaculty, Faculty, Prisma, User } from "@prisma/client";
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
        "filter[departmentId]": Yup.string().optional(),
        "filter[collegeId]": Yup.string().optional(),
        "filter[status]": Yup.string().oneOf([
          "IMERC_CITL_DIRECTOR_ENDORSED",
          "IMERC_CITL_IDD_COORDINATOR_ENDORSED",
          "IMERC_CITL_REVISED",
          "IMERC_CITL_REVIEWED",
          "IMERC_QAMIS_DEPARTMENT_ENDORSED",
          "IMERC_QAMIS_REVISED",
          "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED",
          "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED",
          "IMPLEMENTATION_CITL_REVISED",
          "IMPLEMENTATION_CITL_REVIEWED",
          "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED",
          "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED",
          "IMPLEMENTATION_DEPARTMENT_REVISED",
          "IMPLEMENTATION_DEPARTMENT_REVIEWED",
          "IMPLEMENTATION_DEPARTMENT_REVIEW",
          "IMPLEMENTATION_DRAFT",
        ]),
      });
      await validator.validate(req.query);

      const {
        "filter[collegeId]": filterCollegeId,
        "filter[departmentId]": filterDepartmentId,
        "filter[status]": filterStatus,
      } = validator.cast(req.query);
      console.log({ filterCollegeId, filterDepartmentId, query: req.query });

      const ability = iMAbility({ user });

      let statusWhere: Prisma.IMWhereInput = {};
      switch (filterStatus) {
        case "IMPLEMENTATION_DRAFT":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  none: {
                    DepartmentReview: {
                      isNot: null,
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMPLEMENTATION_DEPARTMENT_REVIEW":
          statusWhere = {
            AND: [
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
            ],
          };
          break;
        case "IMPLEMENTATION_DEPARTMENT_REVIEWED":
          statusWhere = {
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
              {
                IMFile: {
                  none: {
                    DepartmentRevision: {
                      returned: false,
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMPLEMENTATION_DEPARTMENT_REVISED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    DepartmentRevision: {
                      returned: false,
                    },
                  },
                },
              },
              {
                NOT: {
                  IMFile: {
                    some: {
                      DepartmentRevision: {
                        returned: false,
                        CoordinatorEndorsement: {
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    DepartmentRevision: {
                      returned: false,
                      CoordinatorEndorsement: {
                        isNot: null,
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
                        returned: false,
                        CoordinatorEndorsement: {
                          DeanEndorsement: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    DepartmentRevision: {
                      returned: false,
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
                  none: {
                    DepartmentRevision: {
                      returned: false,
                      CoordinatorEndorsement: {
                        DeanEndorsement: {
                          IDDCoordinatorSuggestion: {
                            SubmittedIDDCoordinatorSuggestion: {
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
          };
          break;
        case "IMPLEMENTATION_CITL_REVIEWED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    DepartmentRevision: {
                      CoordinatorEndorsement: {
                        DeanEndorsement: {
                          IDDCoordinatorSuggestion: {
                            SubmittedIDDCoordinatorSuggestion: {
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
                NOT: {
                  IMFile: {
                    some: {
                      CITLRevision: {
                        returned: false,
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMPLEMENTATION_CITL_REVISED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    CITLRevision: {
                      returned: false,
                    },
                  },
                },
              },
              {
                NOT: {
                  IMFile: {
                    some: {
                      CITLRevision: {
                        returned: false,
                        IDDCoordinatorEndorsement: {
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    CITLRevision: {
                      returned: false,
                      IDDCoordinatorEndorsement: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
              {
                NOT: {
                  IMFile: {
                    some: {
                      CITLRevision: {
                        returned: false,
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
            ],
          };
          break;
        case "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    CITLRevision: {
                      returned: false,
                      IDDCoordinatorEndorsement: {
                        CITLDirectorEndorsement: {
                          isNot: null,
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
                        isNot: null,
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMERC_QAMIS_REVISED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      isNot: null,
                    },
                  },
                },
              },
              {
                NOT: {
                  IMFile: {
                    some: {
                      QAMISRevision: {
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
            ],
          };
          break;
        case "IMERC_QAMIS_DEPARTMENT_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    QAMISRevision: {
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
                NOT: {
                  IMFile: {
                    some: {
                      QAMISRevision: {
                        QAMISDeanEndorsement: {
                          QAMISDepartmentEndorsement: {
                            ContentEditorReview: {
                              ContentEditorSuggestion: {
                                SubmittedContentEditorSuggestion: {
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
              },
            ],
          };
          break;
        case "IMERC_CITL_REVIEWED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISDeanEndorsement: {
                        QAMISDepartmentEndorsement: {
                          ContentEditorReview: {
                            ContentEditorSuggestion: {
                              SubmittedContentEditorSuggestion: {
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
                NOT: {
                  IMFile: {
                    some: {
                      IMERCCITLRevision: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMERC_CITL_REVISED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    IMERCCITLRevision: {
                      isNot: null,
                    },
                  },
                },
              },
              {
                NOT: {
                  IMFile: {
                    some: {
                      IMERCCITLRevision: {
                        IMERCIDDCoordinatorEndorsement: {
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
        case "IMERC_CITL_IDD_COORDINATOR_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    IMERCCITLRevision: {
                      IMERCIDDCoordinatorEndorsement: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
              {
                NOT: {
                  IMFile: {
                    some: {
                      IMERCCITLRevision: {
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
            ],
          };
          break;
        case "IMERC_CITL_DIRECTOR_ENDORSED":
          statusWhere = {
            AND: [
              {
                IMFile: {
                  some: {
                    IMERCCITLRevision: {
                      IMERCIDDCoordinatorEndorsement: {
                        IMERCCITLDirectorEndorsement: {
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            ],
          };
          break;
      }

      const count = await prisma.iM.count({
        where: {
          AND: [
            {
              Faculty: {
                Department: {
                  id: {
                    contains: filterDepartmentId,
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  College: {
                    id: {
                      contains: filterCollegeId,
                    },
                  },
                },
              },
            },
            statusWhere,
          ],
        },
      });
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
