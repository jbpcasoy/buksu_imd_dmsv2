import prisma from "@/prisma/client";
import logger from "@/services/logger";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        ])
        .optional()
        .transform((originalValue) => {
          return originalValue === "" ? undefined : originalValue;
        }),
        "filter[start]": Yup.date().optional(),
        "filter[end]": Yup.date().optional(),
      });
      await validator.validate(req.query);

      const {
        "filter[collegeId]": filterCollegeId,
        "filter[departmentId]": filterDepartmentId,
        "filter[status]": filterStatus,
        "filter[start]": filterStart,
        "filter[end]": filterEnd,
      } = validator.cast(req.query);

      const count = await countIMs(
        filterStart,
        filterEnd,
        filterStatus,
        filterDepartmentId,
        filterCollegeId
      );
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

export async function countIMs(
  filterStart: Date | undefined,
  filterEnd: Date | undefined,
  filterStatus: string | undefined,
  filterDepartmentId: string | undefined,
  filterCollegeId: string | undefined
) {
  let startWhere: Prisma.IMWhereInput = {
    createdAt: {
      gte: filterStart,
    },
  };
  let endWhere: Prisma.IMWhereInput = {
    createdAt: {
      lte: filterEnd,
    },
  };
  let statusWhere: Prisma.IMWhereInput = {};
  switch (filterStatus) {
    case "IMPLEMENTATION_DRAFT":
      statusWhere = {
        AND: [
          {
            NOT: {
              IMFile: {
                some: {
                  DepartmentReview: {
                    isNot: null,
                  },
                },
              },
            },
          },
        ],
      };
      startWhere = {
        createdAt: {
          gte: filterStart,
        },
      };
      endWhere = {
        createdAt: {
          lte: filterEnd,
        },
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
                NOT: {
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
              },
              {
                NOT: {
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
              },
              {
                NOT: {
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
              },
            ],
          },
        ],
      };

      startWhere = {
        IMFile: {
          some: {
            DepartmentReview: {
              createdAt: {
                gte: filterStart,
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            DepartmentReview: {
              createdAt: {
                lte: filterEnd,
              },
            },
          },
        },
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
            NOT: {
              IMFile: {
                some: {
                  DepartmentRevision: {
                    OR: [
                      {
                        ReturnedDepartmentRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedDepartmentRevision: {
                          SubmittedReturnedDepartmentRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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
                    isNot: null,
                  },
                },
              },
            },
          },
        ],
      };

      startWhere = {
        IMFile: {
          some: {
            DepartmentReview: {
              CoordinatorReview: {
                CoordinatorSuggestion: {
                  SubmittedCoordinatorSuggestion: {
                    DepartmentReviewed: {
                      createdAt: {
                        gte: filterStart,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            DepartmentReview: {
              CoordinatorReview: {
                CoordinatorSuggestion: {
                  SubmittedCoordinatorSuggestion: {
                    DepartmentReviewed: {
                      createdAt: {
                        lte: filterEnd,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_REVISED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentRevision: {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
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
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
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

      startWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                gte: filterStart,
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                lte: filterEnd,
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentRevision: {
                  OR: [
                    {
                      ReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedDepartmentRevision: {
                        SubmittedReturnedDepartmentRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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
                    OR: [
                      {
                        ReturnedDepartmentRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedDepartmentRevision: {
                          SubmittedReturnedDepartmentRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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

      startWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              CoordinatorEndorsement: {
                createdAt: {
                  gte: filterStart,
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              CoordinatorEndorsement: {
                createdAt: {
                  lte: filterEnd,
                },
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentRevision: {
                  OR: [
                    {
                      ReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedDepartmentRevision: {
                        SubmittedReturnedDepartmentRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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
            NOT: {
              IMFile: {
                some: {
                  DepartmentRevision: {
                    OR: [
                      {
                        ReturnedDepartmentRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedDepartmentRevision: {
                          SubmittedReturnedDepartmentRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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
          },
        ],
      };

      startWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              CoordinatorEndorsement: {
                DeanEndorsement: {
                  createdAt: {
                    gte: filterStart,
                  },
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              CoordinatorEndorsement: {
                DeanEndorsement: {
                  createdAt: {
                    lte: filterEnd,
                  },
                },
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_CITL_REVIEWED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                DepartmentRevision: {
                  OR: [
                    {
                      ReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedDepartmentRevision: {
                        SubmittedReturnedDepartmentRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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
                    OR: [
                      {
                        ReturnedCITLRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedCITLRevision: {
                          SubmittedReturnedCITLRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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
                    isNot: null,
                  },
                },
              },
            },
          },
        ],
      };

      startWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              CoordinatorEndorsement: {
                DeanEndorsement: {
                  IDDCoordinatorSuggestion: {
                    SubmittedIDDCoordinatorSuggestion: {
                      createdAt: {
                        gte: filterStart,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            DepartmentRevision: {
              OR: [
                {
                  ReturnedDepartmentRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              ],
              CoordinatorEndorsement: {
                DeanEndorsement: {
                  IDDCoordinatorSuggestion: {
                    SubmittedIDDCoordinatorSuggestion: {
                      createdAt: {
                        lte: filterEnd,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_CITL_REVISED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                CITLRevision: {
                  OR: [
                    {
                      ReturnedCITLRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedCITLRevision: {
                        SubmittedReturnedCITLRevision: {
                          is: null,
                        },
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
                  CITLRevision: {
                    OR: [
                      {
                        ReturnedCITLRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedCITLRevision: {
                          SubmittedReturnedCITLRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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

      startWhere = {
        IMFile: {
          some: {
            CITLRevision: {
              OR: [
                {
                  ReturnedCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                gte: filterStart,
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            CITLRevision: {
              OR: [
                {
                  ReturnedCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                lte: filterEnd,
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                CITLRevision: {
                  OR: [
                    {
                      ReturnedCITLRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedCITLRevision: {
                        SubmittedReturnedCITLRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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
                    OR: [
                      {
                        ReturnedCITLRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedCITLRevision: {
                          SubmittedReturnedCITLRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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

      startWhere = {
        IMFile: {
          some: {
            CITLRevision: {
              OR: [
                {
                  ReturnedCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IDDCoordinatorEndorsement: {
                createdAt: {
                  gte: filterStart,
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            CITLRevision: {
              OR: [
                {
                  ReturnedCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IDDCoordinatorEndorsement: {
                createdAt: {
                  lte: filterEnd,
                },
              },
            },
          },
        },
      };
      break;
    case "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                CITLRevision: {
                  OR: [
                    {
                      ReturnedCITLRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedCITLRevision: {
                        SubmittedReturnedCITLRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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

      startWhere = {
        IMFile: {
          some: {
            CITLRevision: {
              OR: [
                {
                  ReturnedCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IDDCoordinatorEndorsement: {
                CITLDirectorEndorsement: {
                  createdAt: {
                    gte: filterStart,
                  },
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            CITLRevision: {
              OR: [
                {
                  ReturnedCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IDDCoordinatorEndorsement: {
                CITLDirectorEndorsement: {
                  createdAt: {
                    lte: filterEnd,
                  },
                },
              },
            },
          },
        },
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

      startWhere = {
        IMFile: {
          some: {
            QAMISRevision: {
              createdAt: {
                gte: filterStart,
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            QAMISRevision: {
              createdAt: {
                lte: filterEnd,
              },
            },
          },
        },
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

      startWhere = {
        IMFile: {
          some: {
            QAMISRevision: {
              QAMISDeanEndorsement: {
                QAMISDepartmentEndorsement: {
                  createdAt: {
                    gte: filterStart,
                  },
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            QAMISRevision: {
              QAMISDeanEndorsement: {
                QAMISDepartmentEndorsement: {
                  createdAt: {
                    lte: filterEnd,
                  },
                },
              },
            },
          },
        },
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
                    OR: [
                      {
                        ReturnedIMERCCITLRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedIMERCCITLRevision: {
                          SubmittedReturnedIMERCCITLRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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

      startWhere = {
        IMFile: {
          some: {
            QAMISRevision: {
              QAMISDeanEndorsement: {
                QAMISDepartmentEndorsement: {
                  ContentEditorReview: {
                    ContentEditorSuggestion: {
                      SubmittedContentEditorSuggestion: {
                        IMERCCITLReviewed: {
                          createdAt: {
                            gte: filterStart,
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
      };
      endWhere = {
        IMFile: {
          some: {
            QAMISRevision: {
              QAMISDeanEndorsement: {
                QAMISDepartmentEndorsement: {
                  ContentEditorReview: {
                    ContentEditorSuggestion: {
                      SubmittedContentEditorSuggestion: {
                        IMERCCITLReviewed: {
                          createdAt: {
                            lte: filterEnd,
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
      };
      break;
    case "IMERC_CITL_REVISED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                IMERCCITLRevision: {
                  OR: [
                    {
                      ReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedIMERCCITLRevision: {
                        SubmittedReturnedIMERCCITLRevision: {
                          is: null,
                        },
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
                  IMERCCITLRevision: {
                    OR: [
                      {
                        ReturnedIMERCCITLRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedIMERCCITLRevision: {
                          SubmittedReturnedIMERCCITLRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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

      startWhere = {
        IMFile: {
          some: {
            IMERCCITLRevision: {
              OR: [
                {
                  ReturnedIMERCCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                gte: filterStart,
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            IMERCCITLRevision: {
              OR: [
                {
                  ReturnedIMERCCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                lte: filterEnd,
              },
            },
          },
        },
      };
      break;
    case "IMERC_CITL_IDD_COORDINATOR_ENDORSED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                IMERCCITLRevision: {
                  OR: [
                    {
                      ReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedIMERCCITLRevision: {
                        SubmittedReturnedIMERCCITLRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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
                    OR: [
                      {
                        ReturnedIMERCCITLRevision: {
                          is: null,
                        },
                      },
                      {
                        ReturnedIMERCCITLRevision: {
                          SubmittedReturnedIMERCCITLRevision: {
                            is: null,
                          },
                        },
                      },
                    ],
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

      startWhere = {
        IMFile: {
          some: {
            IMERCCITLRevision: {
              OR: [
                {
                  ReturnedIMERCCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IMERCIDDCoordinatorEndorsement: {
                createdAt: {
                  gte: filterStart,
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            IMERCCITLRevision: {
              OR: [
                {
                  ReturnedIMERCCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              createdAt: {
                lte: filterEnd,
              },
            },
          },
        },
      };
      break;
    case "IMERC_CITL_DIRECTOR_ENDORSED":
      statusWhere = {
        AND: [
          {
            IMFile: {
              some: {
                IMERCCITLRevision: {
                  OR: [
                    {
                      ReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                    {
                      ReturnedIMERCCITLRevision: {
                        SubmittedReturnedIMERCCITLRevision: {
                          is: null,
                        },
                      },
                    },
                  ],
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

      startWhere = {
        IMFile: {
          some: {
            IMERCCITLRevision: {
              OR: [
                {
                  ReturnedIMERCCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IMERCIDDCoordinatorEndorsement: {
                IMERCCITLDirectorEndorsement: {
                  createdAt: {
                    gte: filterStart,
                  },
                },
              },
            },
          },
        },
      };
      endWhere = {
        IMFile: {
          some: {
            IMERCCITLRevision: {
              OR: [
                {
                  ReturnedIMERCCITLRevision: {
                    is: null,
                  },
                },
                {
                  ReturnedIMERCCITLRevision: {
                    SubmittedReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                },
              ],
              IMERCIDDCoordinatorEndorsement: {
                IMERCCITLDirectorEndorsement: {
                  createdAt: {
                    lte: filterEnd,
                  },
                },
              },
            },
          },
        },
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
        startWhere,
        endWhere,
      ],
    },
  });
  return count;
}
