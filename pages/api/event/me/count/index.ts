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
      const activeIDDCoordinator = await prisma.activeIDDCoordinator.findFirst({
        where: {
          IDDCoordinator: {
            User: {
              id: {
                equals: user.id,
              },
            },
          },
        },
      });

      const activeCITLDirector = await prisma.activeCITLDirector.findFirst({
        where: {
          CITLDirector: {
            User: {
              id: {
                equals: user.id,
              },
            },
          },
        },
      });

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
              AND: [
                {
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
                {
                  IMFile: {
                    NOT: {
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
              ],
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
            OR: [
              {
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
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          {
            type: "DEAN_ENDORSEMENT_CREATED",
            OR: [
              {
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
              activeIDDCoordinator
                ? {
                    type: "DEAN_ENDORSEMENT_CREATED",
                  }
                : {
                    NOT: {
                      type: "DEAN_ENDORSEMENT_CREATED",
                    },
                  },
            ],
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
            OR: [
              activeIDDCoordinator
                ? {
                    type: "CITL_REVISION_CREATED",
                  }
                : {
                    NOT: {
                      type: "CITL_REVISION_CREATED",
                    },
                  },
            ],
          },
          {
            type: "IDD_COORDINATOR_ENDORSEMENT_CREATED",
            OR: [
              {
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
              activeCITLDirector
                ? {
                    type: "IDD_COORDINATOR_ENDORSEMENT_CREATED",
                  }
                : {
                    NOT: {
                      type: "IDD_COORDINATOR_ENDORSEMENT_CREATED",
                    },
                  },
            ],
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
            OR: [
              {
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
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          Faculty: {
                            Department: {
                              Faculty: {
                                some: {
                                  ContentSpecialist: {
                                    ActiveContentSpecialist: {
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
              },
              activeCITLDirector || activeIDDCoordinator
                ? {
                    type: "QAMIS_DEPARTMENT_ENDORSEMENT_CREATED",
                  }
                : {
                    NOT: {
                      type: "QAMIS_DEPARTMENT_ENDORSEMENT_CREATED",
                    },
                  },
            ],
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
            OR: [
              {
                IMERCCITLRevision: {
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
              activeIDDCoordinator
                ? {
                    type: "IMERC_CITL_REVISION_CREATED",
                  }
                : {
                    NOT: {
                      type: "IMERC_CITL_REVISION_CREATED",
                    },
                  },
            ],
          },
          {
            type: "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED",
            OR: [
              {
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
              activeCITLDirector
                ? {
                    type: "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED",
                  }
                : {
                    NOT: {
                      type: "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED",
                    },
                  },
            ],
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

      const count = await prisma.event.count({
        where: {
          AND: [
            accessibleBy(ability).Event,
            whereQuery,
            {
              NotificationRead: {
                none: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
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
