import prisma from "@/prisma/client";
import eventAbility from "@/services/ability/eventAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Prisma, User } from "@prisma/client";
import { equal } from "assert";
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
        "filter[read]": Yup.string().optional().default("unread"),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[read]": filterRead,
      } = validator.cast(req.query);

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
            type: "SUBMITTED_RETURNED_DEPARTMENT_REVISION_CREATED",
            SubmittedReturnedDepartmentRevision: {
              ReturnedDepartmentRevision: {
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
            type: "SUBMITTED_RETURNED_CITL_REVISION_CREATED",
            SubmittedReturnedCITLRevision: {
              ReturnedCITLRevision: {
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
            type: "SUBMITTED_RETURNED_IMERC_CITL_REVISION_CREATED",
            SubmittedReturnedIMERCCITLRevision: {
              ReturnedIMERCCITLRevision: {
                IMERCCITLRevision: {
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

      let events;
      let count;
      if (filterRead === "unread") {
        events = await prisma.event.findMany({
          skip,
          take,
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
          orderBy: {
            updatedAt: "desc",
          },
        });
        count = await prisma.event.count({
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
      } else if (filterRead === "read") {
        events = await prisma.event.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).Event,
              whereQuery,
              {
                NotificationRead: {
                  some: {
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
          orderBy: {
            updatedAt: "desc",
          },
        });
        count = await prisma.event.count({
          where: {
            AND: [
              accessibleBy(ability).Event,
              whereQuery,
              {
                NotificationRead: {
                  some: {
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
      } else {
        events = await prisma.event.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).Event, whereQuery],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
        count = await prisma.event.count({
          where: {
            AND: [accessibleBy(ability).Event, whereQuery],
          },
        });
      }

      for (let event of events) {
        switch (event.type) {
          case "DEPARTMENT_REVIEW_CREATED":
            const departmentReview =
              await prisma.departmentReview.findUniqueOrThrow({
                where: {
                  id: event.departmentReviewId as string,
                },
                include: {
                  IMFile: true,
                },
              });
            event.url = `/im/${departmentReview.IMFile.iMId}`;
            event.message = "An IM has been submitted for review.";
            break;
          case "SUBMITTED_PEER_SUGGESTION_CREATED":
            const submittedPeerSuggestion =
              await prisma.submittedPeerSuggestion.findUniqueOrThrow({
                where: {
                  id: event.submittedPeerSuggestionId as string,
                },
                include: {
                  PeerSuggestion: {
                    select: {
                      PeerReview: {
                        select: {
                          DepartmentReview: {
                            select: {
                              IMFile: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${submittedPeerSuggestion?.PeerSuggestion.PeerReview.DepartmentReview.IMFile.iMId}`;
            event.message = "An IM has been reviewed by a Peer.";
            break;
          case "SUBMITTED_COORDINATOR_SUGGESTION_CREATED":
            const submittedCoordinatorSuggestion =
              await prisma.submittedCoordinatorSuggestion.findUniqueOrThrow({
                where: {
                  id: event.submittedCoordinatorSuggestionId as string,
                },
                include: {
                  CoordinatorSuggestion: {
                    select: {
                      CoordinatorReview: {
                        select: {
                          DepartmentReview: {
                            select: {
                              IMFile: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${submittedCoordinatorSuggestion.CoordinatorSuggestion.CoordinatorReview.DepartmentReview.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the Coordinator.";
            break;
          case "SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED":
            const submittedChairpersonSuggestion =
              await prisma.submittedChairpersonSuggestion.findUniqueOrThrow({
                where: {
                  id: event.submittedChairpersonSuggestionId as string,
                },
                include: {
                  ChairpersonSuggestion: {
                    select: {
                      ChairpersonReview: {
                        select: {
                          DepartmentReview: {
                            select: {
                              IMFile: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${submittedChairpersonSuggestion.ChairpersonSuggestion.ChairpersonReview.DepartmentReview.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the Chairperson.";
            break;
          case "DEPARTMENT_REVIEWED_CREATED":
            const departmentReviewed =
              await prisma.departmentReviewed.findUniqueOrThrow({
                where: {
                  id: event.departmentReviewedId as string,
                },
                include: {
                  SubmittedCoordinatorSuggestion: {
                    select: {
                      CoordinatorSuggestion: {
                        select: {
                          CoordinatorReview: {
                            select: {
                              DepartmentReview: {
                                select: {
                                  IMFile: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${departmentReviewed.SubmittedCoordinatorSuggestion.CoordinatorSuggestion.CoordinatorReview.DepartmentReview.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the department.";
            break;
          case "DEPARTMENT_REVISION_CREATED":
            const departmentRevision =
              await prisma.departmentRevision.findUniqueOrThrow({
                where: {
                  id: event.departmentRevisionId as string,
                },
                include: {
                  IMFile: true,
                },
              });
            event.url = `/im/${departmentRevision.IMFile.iMId}`;
            event.message = "An IM has been revised.";
            break;
          case "SUBMITTED_RETURNED_DEPARTMENT_REVISION_CREATED":
            const submittedReturnedDepartmentRevision =
              await prisma.submittedReturnedDepartmentRevision.findUniqueOrThrow(
                {
                  where: {
                    id: event.submittedReturnedDepartmentRevisionId as string,
                  },
                  include: {
                    ReturnedDepartmentRevision: {
                      include: {
                        DepartmentRevision: {
                          include: {
                            IMFile: true,
                          },
                        },
                      },
                    },
                  },
                }
              );
            event.url = `/im/${submittedReturnedDepartmentRevision.ReturnedDepartmentRevision.DepartmentRevision.IMFile.iMId}`;
            event.message = "An IM has been returned from department review.";
            break;
          case "COORDINATOR_ENDORSEMENT_CREATED":
            const coordinatorEndorsement =
              await prisma.coordinatorEndorsement.findUniqueOrThrow({
                where: {
                  id: event.coordinatorEndorsementId as string,
                },
                include: {
                  DepartmentRevision: {
                    select: {
                      IMFile: true,
                    },
                  },
                },
              });
            event.url = `/im/${coordinatorEndorsement.DepartmentRevision.IMFile.iMId}`;
            event.message = "An IM has been endorsed by the Coordinator.";
            break;
          case "DEAN_ENDORSEMENT_CREATED":
            const deanEndorsement =
              await prisma.deanEndorsement.findUniqueOrThrow({
                where: {
                  id: event.deanEndorsementId as string,
                },
                include: {
                  CoordinatorEndorsement: {
                    select: {
                      DepartmentRevision: {
                        select: {
                          IMFile: true,
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${deanEndorsement.CoordinatorEndorsement.DepartmentRevision.IMFile.iMId}`;
            event.message = "An IM has been endorsed by the Dean.";
            break;
          case "SUBMITTED_IDD_COORDINATOR_SUGGESTION_CREATED":
            const submittedIDDCoordinatorSuggestion =
              await prisma.submittedIDDCoordinatorSuggestion.findUniqueOrThrow({
                where: {
                  id: event.submittedIDDCoordinatorSuggestionId as string,
                },
                include: {
                  IDDCoordinatorSuggestion: {
                    select: {
                      DeanEndorsement: {
                        select: {
                          CoordinatorEndorsement: {
                            select: {
                              DepartmentRevision: {
                                select: {
                                  IMFile: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${submittedIDDCoordinatorSuggestion.IDDCoordinatorSuggestion.DeanEndorsement.CoordinatorEndorsement.DepartmentRevision.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the IDD coordinator.";
            break;
          case "CITL_REVISION_CREATED":
            const cITLRevision = await prisma.cITLRevision.findUniqueOrThrow({
              where: {
                id: event.cITLRevisionId as string,
              },
              include: {
                IMFile: true,
              },
            });
            event.url = `/im/${cITLRevision.IMFile.iMId}`;
            event.message = "An IM has been revised.";
            break;
          case "SUBMITTED_RETURNED_CITL_REVISION_CREATED":
            const submittedReturnedCITLRevision =
              await prisma.submittedReturnedCITLRevision.findUniqueOrThrow(
                {
                  where: {
                    id: event.submittedReturnedCITLRevisionId as string,
                  },
                  include: {
                    ReturnedCITLRevision: {
                      include: {
                        CITLRevision: {
                          include: {
                            IMFile: true,
                          },
                        },
                      },
                    },
                  },
                }
              );
            event.url = `/im/${submittedReturnedCITLRevision.ReturnedCITLRevision.CITLRevision.IMFile.iMId}`;
            event.message = "An IM has been returned from CITL review.";
            break;
          case "IDD_COORDINATOR_ENDORSEMENT_CREATED":
            const iDDCoordinatorEndorsement =
              await prisma.iDDCoordinatorEndorsement.findUniqueOrThrow({
                where: {
                  id: event.iDDCoordinatorEndorsementId as string,
                },
                include: {
                  CITLRevision: {
                    select: {
                      IMFile: true,
                    },
                  },
                },
              });
            event.url = `/im/${iDDCoordinatorEndorsement.CITLRevision.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the IDD coordinator.";
            break;
          case "CITL_DIRECTOR_ENDORSEMENT_CREATED":
            const cITLDirectorEndorsement =
              await prisma.cITLDirectorEndorsement.findUniqueOrThrow({
                where: {
                  id: event.cITLDirectorEndorsementId as string,
                },
                select: {
                  IDDCoordinatorEndorsement: {
                    select: {
                      CITLRevision: {
                        select: {
                          IMFile: true,
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${cITLDirectorEndorsement.IDDCoordinatorEndorsement.CITLRevision.IMFile.iMId}`;
            event.message = "An IM has been endorsed by the CITL director.";
            break;
          case "QAMIS_REVISION_CREATED":
            const qAMISRevision = await prisma.qAMISRevision.findUniqueOrThrow({
              where: {
                id: event.qAMISRevisionId as string,
              },
              include: {
                IMFile: true,
              },
            });
            event.url = `/im/${qAMISRevision.IMFile.iMId}`;
            event.message = "An IM has been submitted for IMERC endorsement.";
            break;
          case "QAMIS_COORDINATOR_ENDORSEMENT_CREATED":
            const qAMISCoordinatorEndorsement =
              await prisma.qAMISCoordinatorEndorsement.findUniqueOrThrow({
                where: {
                  id: event.qAMISCoordinatorEndorsementId as string,
                },
                include: {
                  QAMISRevision: {
                    select: {
                      IMFile: true,
                    },
                  },
                },
              });
            event.url = `/im/${qAMISCoordinatorEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message =
              "An IM has been endorsed by the Coordinator for IMERC review.";
            break;
          case "QAMIS_CHAIRPERSON_ENDORSEMENT_CREATED":
            const qAMISChairpersonEndorsement =
              await prisma.qAMISChairpersonEndorsement.findUniqueOrThrow({
                where: {
                  id: event.qAMISChairpersonEndorsementId as string,
                },
                include: {
                  QAMISRevision: {
                    select: {
                      IMFile: true,
                    },
                  },
                },
              });
            event.url = `/im/${qAMISChairpersonEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message =
              "An IM has been endorsed by the Chairperson for IMERC review.";
            break;
          case "QAMIS_DEAN_ENDORSEMENT_CREATED":
            const qAMISDeanEndorsement =
              await prisma.qAMISDeanEndorsement.findUniqueOrThrow({
                where: {
                  id: event.qAMISDeanEndorsementId as string,
                },
                include: {
                  QAMISRevision: {
                    select: {
                      IMFile: true,
                    },
                  },
                },
              });
            event.url = `/im/${qAMISDeanEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message =
              "An IM has been endorsed by the Dean for IMERC review.";
            break;
          case "QAMIS_DEPARTMENT_ENDORSEMENT_CREATED":
            const qAMISDepartmentEndorsement =
              await prisma.qAMISDepartmentEndorsement.findUniqueOrThrow({
                where: {
                  id: event.qAMISDepartmentEndorsementId as string,
                },
                include: {
                  QAMISDeanEndorsement: {
                    select: {
                      QAMISRevision: {
                        select: {
                          IMFile: true,
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${qAMISDepartmentEndorsement.QAMISDeanEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message =
              "An IM has been endorsed by the Department for IMERC review.";
            break;
          case "SUBMITTED_CONTENT_SPECIALIST_SUGGESTION_CREATED":
            const submittedContentSpecialist =
              await prisma.submittedContentSpecialistSuggestion.findUniqueOrThrow(
                {
                  where: {
                    id: event.submittedContentSpecialistSuggestionId as string,
                  },
                  include: {
                    ContentSpecialistSuggestion: {
                      select: {
                        ContentSpecialistReview: {
                          select: {
                            QAMISDepartmentEndorsement: {
                              select: {
                                QAMISDeanEndorsement: {
                                  select: {
                                    QAMISRevision: {
                                      select: {
                                        IMFile: true,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              );
            event.url = `/im/${submittedContentSpecialist.ContentSpecialistSuggestion.ContentSpecialistReview.QAMISDepartmentEndorsement.QAMISDeanEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message = "Yor IM has been reviewed by a Content Specialist.";
            break;
          case "SUBMITTED_IDD_SPECIALIST_SUGGESTION_CREATED":
            const submittedIDDSpecialistSuggestion =
              await prisma.submittedIDDSpecialistSuggestion.findUniqueOrThrow({
                where: {
                  id: event.submittedIDDSpecialistSuggestionId as string,
                },
                include: {
                  IDDSpecialistSuggestion: {
                    select: {
                      IDDSpecialistReview: {
                        select: {
                          QAMISDepartmentEndorsement: {
                            select: {
                              QAMISDeanEndorsement: {
                                select: {
                                  QAMISRevision: {
                                    select: {
                                      IMFile: true,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${submittedIDDSpecialistSuggestion.IDDSpecialistSuggestion.IDDSpecialistReview.QAMISDepartmentEndorsement.QAMISDeanEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the IDD Specialist.";
            break;
          case "SUBMITTED_CONTENT_EDITOR_SUGGESTION_CREATED":
            const submittedContentEditorSuggestion =
              await prisma.submittedContentEditorSuggestion.findUniqueOrThrow({
                where: {
                  id: event.submittedContentEditorSuggestionId as string,
                },
                include: {
                  ContentEditorSuggestion: {
                    select: {
                      ContentEditorReview: {
                        select: {
                          QAMISDepartmentEndorsement: {
                            select: {
                              QAMISDeanEndorsement: {
                                select: {
                                  QAMISRevision: {
                                    select: {
                                      IMFile: true,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${submittedContentEditorSuggestion.ContentEditorSuggestion.ContentEditorReview.QAMISDepartmentEndorsement.QAMISDeanEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message = "An IM has been reviewed by the Content Editor.";
            break;
          case "IMERC_CITL_REVIEWED_CREATED":
            const iMERCCITLReviewed =
              await prisma.iMERCCITLReviewed.findUniqueOrThrow({
                where: {
                  id: event.iMERCCITLReviewedId as string,
                },
                include: {
                  SubmittedContentEditorSuggestion: {
                    select: {
                      ContentEditorSuggestion: {
                        select: {
                          ContentEditorReview: {
                            select: {
                              QAMISDepartmentEndorsement: {
                                select: {
                                  QAMISDeanEndorsement: {
                                    select: {
                                      QAMISRevision: {
                                        select: {
                                          IMFile: true,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${iMERCCITLReviewed.SubmittedContentEditorSuggestion.ContentEditorSuggestion.ContentEditorReview.QAMISDepartmentEndorsement.QAMISDeanEndorsement.QAMISRevision.IMFile.iMId}`;
            event.message = "An IM had finished IMERC review.";
            break;
          case "IMERC_CITL_REVISION_CREATED":
            const iMERCCITLRevision =
              await prisma.iMERCCITLRevision.findUniqueOrThrow({
                where: {
                  id: event.iMERCCITLRevisionId as string,
                },
                include: {
                  IMFile: true,
                },
              });
            event.url = `/im/${iMERCCITLRevision.IMFile.iMId}`;
            event.message = "An IM has been revised.";
            break;
            
          case "SUBMITTED_RETURNED_IMERC_CITL_REVISION_CREATED":
            const submittedReturnedIMERCCITLRevision =
              await prisma.submittedReturnedIMERCCITLRevision.findUniqueOrThrow(
                {
                  where: {
                    id: event.submittedReturnedIMERCCITLRevisionId as string,
                  },
                  include: {
                    ReturnedIMERCCITLRevision: {
                      include: {
                        IMERCCITLRevision: {
                          include: {
                            IMFile: true,
                          },
                        },
                      },
                    },
                  },
                }
              );
            event.url = `/im/${submittedReturnedIMERCCITLRevision.ReturnedIMERCCITLRevision.IMERCCITLRevision.IMFile.iMId}`;
            event.message = "An IM has been returned from IMERC review.";
            break;
          case "IMERC_IDD_COORDINATOR_ENDORSEMENT_CREATED":
            const iMERCIDDCoordinatorEndorsement =
              await prisma.iMERCIDDCoordinatorEndorsement.findUniqueOrThrow({
                where: {
                  id: event.iMERCIDDCoordinatorEndorsementId as string,
                },
                include: {
                  IMERCCITLRevision: {
                    select: {
                      IMFile: true,
                    },
                  },
                },
              });
            event.url = `/im/${iMERCIDDCoordinatorEndorsement.IMERCCITLRevision.IMFile.iMId}`;
            event.message =
              "An IM has been endorsed by the IDD coordinator. (IMERC review)";
            break;
          case "IMERC_CITL_DIRECTOR_ENDORSEMENT_CREATED":
            const iMERCCITLDirectorEndorsement =
              await prisma.iMERCCITLDirectorEndorsement.findUniqueOrThrow({
                where: {
                  id: event.iMERCCITLDirectorEndorsementId as string,
                },
                include: {
                  IMERCIDDCoordinatorEndorsement: {
                    select: {
                      IMERCCITLRevision: {
                        select: {
                          IMFile: true,
                        },
                      },
                    },
                  },
                },
              });
            event.url = `/im/${iMERCCITLDirectorEndorsement.IMERCIDDCoordinatorEndorsement.IMERCCITLRevision.IMFile.iMId}`;
            event.message =
              "An IM has been endorsed by the CITL director. (IMERC review)";
            break;
        }
      }

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
