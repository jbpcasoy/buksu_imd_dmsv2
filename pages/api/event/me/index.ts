import prisma from "@/prisma/client";
import eventAbility from "@/services/ability/eventAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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
  const ability = eventAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const whereQuery: Prisma.EventWhereInput = {
        OR: [
          {
            type: "DEPARTMENT_REVIEW_CREATED",
            DepartmentReview: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Coordinator: {
                            ActiveCoordinator: {
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
                  },
                },
              },
            },
          },
          {
            type: "DEPARTMENT_REVIEW_CREATED",
            DepartmentReview: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Chairperson: {
                            ActiveChairperson: {
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
                  },
                },
              },
            },
          },
          {
            type: "DEPARTMENT_REVIEW_CREATED",
            DepartmentReview: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          ActiveFaculty: {
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
          {
            type: "SUBMITTED_PEER_SUGGESTION_CREATED",
            SubmittedPeerSuggestion: {
              PeerSuggestion: {
                PeerReview: {
                  DepartmentReview: {
                    IMFile: {
                      IM: {
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
          {
            type: "SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED",
            SubmittedChairpersonSuggestion: {
              ChairpersonSuggestion: {
                ChairpersonReview: {
                  DepartmentReview: {
                    IMFile: {
                      IM: {
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
          {
            type: "SUBMITTED_COORDINATOR_SUGGESTION_CREATED",
            SubmittedCoordinatorSuggestion: {
              CoordinatorSuggestion: {
                CoordinatorReview: {
                  DepartmentReview: {
                    IMFile: {
                      IM: {
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
          {
            type: "DEPARTMENT_REVIEWED_CREATED",
            DepartmentReviewed: {
              SubmittedPeerSuggestion: {
                PeerSuggestion: {
                  PeerReview: {
                    DepartmentReview: {
                      IMFile: {
                        IM: {
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
              SubmittedChairpersonSuggestion: {
                ChairpersonSuggestion: {
                  ChairpersonReview: {
                    DepartmentReview: {
                      IMFile: {
                        IM: {
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
              SubmittedCoordinatorSuggestion: {
                CoordinatorSuggestion: {
                  CoordinatorReview: {
                    DepartmentReview: {
                      IMFile: {
                        IM: {
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
          {
            type: "DEPARTMENT_REVISION_CREATED",
            DepartmentRevision: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Coordinator: {
                            ActiveCoordinator: {
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
                  },
                },
              },
            },
          },
          {
            type: "COORDINATOR_ENDORSEMENT_CREATED",
            CoordinatorEndorsement: {
              DepartmentRevision: {
                DepartmentReviewed: {
                  SubmittedPeerSuggestion: {
                    PeerSuggestion: {
                      PeerReview: {
                        DepartmentReview: {
                          IMFile: {
                            IM: {
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
          {
            type: "DEAN_ENDORSEMENT_CREATED",
            DeanEndorsement: {
              CoordinatorEndorsement: {
                DepartmentRevision: {
                  DepartmentReviewed: {
                    SubmittedPeerSuggestion: {
                      PeerSuggestion: {
                        PeerReview: {
                          DepartmentReview: {
                            IMFile: {
                              IM: {
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
          {
            type: "SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED",
            SubmittedIDDCoordinatorSuggestion: {
              IDDCoordinatorSuggestion: {
                DeanEndorsement: {
                  CoordinatorEndorsement: {
                    DepartmentRevision: {
                      IMFile: {
                        IM: {
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
          {
            type: "CITL_REVISION_CREATED",
            CITLRevision: {
              IDDCoordinatorEndorsement: {
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
          {
            type: "IDD_COORDINATOR_ENDORSEMENT_CREATED",
            IDDCoordinatorEndorsement: {
              CITLRevision: {
                IMFile: {
                  IM: {
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
          {
            type: "CITL_DIRECTOR_ENDORSEMENT_CREATED",
            CITLDirectorEndorsement: {
              IDDCoordinatorEndorsement: {
                CITLRevision: {
                  IMFile: {
                    IM: {
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
            type: "QAMIS_REVISION_CREATED",
            QAMISRevision: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Coordinator: {
                            ActiveCoordinator: {
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
                  },
                },
              },
            },
          },
          {
            type: "QAMIS_REVISION_CREATED",
            QAMISRevision: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          Chairperson: {
                            ActiveChairperson: {
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
                  },
                },
              },
            },
          },
          {
            type: "QAMIS_REVISION_CREATED",
            QAMISRevision: {
              IMFile: {
                IM: {
                  Faculty: {
                    Department: {
                      College: {
                        Department: {
                          some: {
                            Faculty: {
                              some: {
                                Dean: {
                                  ActiveDean: {
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
                      },
                    },
                  },
                },
              },
            },
          },
          {
            type: "QAMIS_COORDINATOR_ENDORSEMENT_CREATED",
            QAMISCoordinatorEndorsement: {
              QAMISRevision: {
                IMFile: {
                  IM: {
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
          {
            type: "QAMIS_CHAIRPERSON_ENDORSEMENT_CREATED",
            QAMISChairpersonEndorsement: {
              QAMISRevision: {
                IMFile: {
                  IM: {
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
          {
            type: "QAMIS_DEAN_ENDORSEMENT_CREATED",
            QAMISDeanEndorsement: {
              QAMISRevision: {
                IMFile: {
                  IM: {
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
          {
            type: "QAMIS_DEPARTMENT_ENDORSEMENT_CREATED",
            QAMISDepartmentEndorsement: {
              AND: [
                {
                  QAMISCoordinatorEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
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
                {
                  QAMISChairpersonEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
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
                {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
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
              ],
            },
          },
          {
            type: "SUBMITTED_CONTENT_SPECIALIST_SUGGESTION_CREATED",
            SubmittedContentSpecialistSuggestion: {
              ContentSpecialistSuggestion: {
                ContentSpecialistReview: {
                  QAMISDepartmentEndorsement: {
                    AND: [
                      {
                        QAMISCoordinatorEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                      {
                        QAMISChairpersonEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                      {
                        QAMISDeanEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                    ],
                  },
                },
              },
            },
          },
          {
            type: "SUBMITTED_CONTENT_EDITOR_SUGGESTION_CREATED",
            SubmittedContentEditorSuggestion: {
              ContentEditorSuggestion: {
                ContentEditorReview: {
                  QAMISDepartmentEndorsement: {
                    AND: [
                      {
                        QAMISCoordinatorEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                      {
                        QAMISChairpersonEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                      {
                        QAMISDeanEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                    ],
                  },
                },
              },
            },
          },
          {
            type: "SUBMITTED_IDD_SPECIALIST_SUGGESTION_CREATED",
            SubmittedIDDSpecialistSuggestion: {
              IDDSpecialistSuggestion: {
                IDDSpecialistReview: {
                  QAMISDepartmentEndorsement: {
                    AND: [
                      {
                        QAMISCoordinatorEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                      {
                        QAMISChairpersonEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                      {
                        QAMISDeanEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
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
                    ],
                  },
                },
              },
            },
          },
          {
            type: "IMERC_CITL_REVIEWED_CREATED",
            IMERCCITLReviewed: {
              SubmittedContentEditorSuggestion: {
                ContentEditorSuggestion: {
                  ContentEditorReview: {
                    QAMISDepartmentEndorsement: {
                      AND: [
                        {
                          QAMISCoordinatorEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                        {
                          QAMISChairpersonEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                        {
                          QAMISDeanEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                      ],
                    },
                  },
                },
              },
              SubmittedContentSpecialistSuggestion: {
                ContentSpecialistSuggestion: {
                  ContentSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      AND: [
                        {
                          QAMISCoordinatorEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                        {
                          QAMISChairpersonEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                        {
                          QAMISDeanEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                      ],
                    },
                  },
                },
              },
              SubmittedIDDSpecialistSuggestion: {
                IDDSpecialistSuggestion: {
                  IDDSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      AND: [
                        {
                          QAMISCoordinatorEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                        {
                          QAMISChairpersonEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                        {
                          QAMISDeanEndorsement: {
                            QAMISRevision: {
                              IMFile: {
                                IM: {
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
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            type: "IMERC_CITL_REVISION_CREATED",
            IMERCCITLRevision: {
              returned: false,
              IMERCCITLReviewed: {
                SubmittedContentEditorSuggestion: {
                  ContentEditorSuggestion: {
                    ContentEditorReview: {
                      QAMISDepartmentEndorsement: {
                        AND: [
                          {
                            QAMISCoordinatorEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                          {
                            QAMISChairpersonEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                          {
                            QAMISDeanEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                        ],
                      },
                    },
                  },
                },
                SubmittedContentSpecialistSuggestion: {
                  ContentSpecialistSuggestion: {
                    ContentSpecialistReview: {
                      QAMISDepartmentEndorsement: {
                        AND: [
                          {
                            QAMISCoordinatorEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                          {
                            QAMISChairpersonEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                          {
                            QAMISDeanEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                        ],
                      },
                    },
                  },
                },
                SubmittedIDDSpecialistSuggestion: {
                  IDDSpecialistSuggestion: {
                    IDDSpecialistReview: {
                      QAMISDepartmentEndorsement: {
                        AND: [
                          {
                            QAMISCoordinatorEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                          {
                            QAMISChairpersonEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                          {
                            QAMISDeanEndorsement: {
                              QAMISRevision: {
                                IMFile: {
                                  IM: {
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
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
          {
            type: "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED",
            IMERCIDDCoordinatorEndorsement: {
              IMERCCITLRevision: {
                IMFile: {
                  IM: {
                    Faculty: {
                      User: {
                        id: user.id,
                      },
                    },
                  },
                },
              },
            },
          },
          {
            type: "IMERC_CITL_DIRECTOR_ENDORSEMENT_CREATED",
            IMERCCITLDirectorEndorsement: {
              IMERCIDDCoordinatorEndorsement: {
                IMERCCITLRevision: {
                  IMFile: {
                    IM: {
                      Faculty: {
                        User: {
                          id: user.id,
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

      const events = await prisma.event.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).Event, whereQuery],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.event.count({
        where: {
          AND: [accessibleBy(ability).Event, whereQuery],
        },
      });

      events.forEach((event) => {
        switch (event.type) {
          case "DEPARTMENT_REVIEW_CREATED":
            event.message = "An IM has been submitted for review.";
            break;
          case "SUBMITTED_PEER_SUGGESTION_CREATED":
            event.message = "Your IM has been reviewed by a Peer.";
            break;
          case "SUBMITTED_COORDINATOR_SUGGESTION_CREATED":
            event.message = "Your IM has been reviewed by the Coordinator.";
            break;
          case "SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED":
            event.message = "Your IM has been reviewed by the Chairperson.";
            break;
          case "DEPARTMENT_REVIEWED_CREATED":
            event.message = "Your IM has been reviewed by the department.";
            break;
          case "DEPARTMENT_REVISION_CREATED":
            event.message = "An IM has been revised.";
            break;
          case "COORDINATOR_ENDORSEMENT_CREATED":
            event.message = "Your IM has been endorsed by the Coordinator.";
            break;
          case "DEAN_ENDORSEMENT_CREATED":
            event.message = "Your IM has been endorsed by the Dean.";
            break;
          case "SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED":
            event.message = "Your IM has been reviewed by the IDD Coordinator.";
            break;
          case "CITL_REVISION_CREATED":
            event.message = "An IM has been revised.";
            break;
          case "IDD_COORDINATOR_ENDORSEMENT_CREATED":
            event.message = "Your IM has been reviewed by the IDD Coordinator.";
            break;
          case "CITL_DIRECTOR_ENDORSEMENT_CREATED":
            event.message = "Your IM has been endorsed by the CITL Director.";
            break;
          case "QAMIS_REVISION_CREATED":
            event.message = "An IM has been submitted for IMERC endorsement.";
            break;
          case "QAMIS_COORDINATOR_ENDORSEMENT_CREATED":
            event.message =
              "Your IM has been endorsed by the Coordinator for IMERC review.";
            break;
          case "QAMIS_CHAIRPERSON_ENDORSEMENT_CREATED":
            event.message =
              "Your IM has been endorsed by the Chairperson for IMERC review.";
            break;
          case "QAMIS_DEAN_ENDORSEMENT_CREATED":
            event.message =
              "Your IM has been endorsed by the Dean for IMERC review.";
            break;
          case "QAMIS_DEPARTMENT_ENDORSEMENT_CREATED":
            event.message =
              "Your IM has been endorsed by the Department for IMERC review.";
            break;
          case "SUBMITTED_CONTENT_SPECIALIST_SUGGESTION_CREATED":
            event.message = "Yor IM has been reviewed by a Content Specialist.";
            break;
          case "SUBMITTED_IDD_SPECIALIST_SUGGESTION_CREATED":
            event.message = "Your IM has been reviewed by the IDD Specialist.";
            break;
          case "SUBMITTED_CONTENT_EDITOR_SUGGESTION_CREATED":
            event.message = "Your IM has been reviewed by the Content Editor.";
            break;
          case "IMERC_CITL_REVIEWED_CREATED":
            event.message = "Your IM had finished IMERC review.";
            break;
          case "IMERC_CITL_REVISION_CREATED":
            event.message = "An IM has been revised.";
            break;
          case "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED":
            event.message =
              "Your IM has been endorsed by the IDD Coordinator. (IMERC review)";
            break;
          case "IMERC_CITL_DIRECTOR_ENDORSEMENT_CREATED":
            event.message =
              "Your IM has been endorsed by the CITL Director. (IMERC review)";
            break;
        }
      });

      return res.json({ events, count });
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
