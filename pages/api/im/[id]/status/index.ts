import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Faculty, IM, User } from "@prisma/client";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const { id } = req.query;

      const iM = await prisma.iM.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      const departmentReview = await prisma.departmentReview.findFirst({
        where: {
          IMFile: {
            IM: {
              id: {
                equals: iM.id,
              },
            },
          },
        },
      });

      const departmentReviewed = await prisma.departmentReviewed.findFirst({
        where: {
          AND: [
            {
              SubmittedChairpersonSuggestion: {
                ChairpersonSuggestion: {
                  ChairpersonReview: {
                    DepartmentReview: {
                      id: {
                        equals: departmentReview?.id ?? "undefined",
                      },
                    },
                  },
                },
              },
            },
            {
              SubmittedCoordinatorSuggestion: {
                CoordinatorSuggestion: {
                  CoordinatorReview: {
                    DepartmentReview: {
                      id: {
                        equals: departmentReview?.id ?? "undefined",
                      },
                    },
                  },
                },
              },
            },
            {
              SubmittedPeerSuggestion: {
                PeerSuggestion: {
                  PeerReview: {
                    DepartmentReview: {
                      id: {
                        equals: departmentReview?.id ?? "undefined",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      });

      const departmentRevision = await prisma.departmentRevision.findFirst({
        where: {
          returned: false,
          DepartmentReviewed: {
            id: {
              equals: departmentReviewed?.id ?? "undefined",
            },
          },
        },
      });

      const coordinatorEndorsement =
        await prisma.coordinatorEndorsement.findFirst({
          where: {
            DepartmentRevision: {
              id: {
                equals: departmentRevision?.id ?? "undefined",
              },
            },
          },
        });

      const deanEndorsement = await prisma.deanEndorsement.findFirst({
        where: {
          CoordinatorEndorsement: {
            id: {
              equals: coordinatorEndorsement?.id ?? "undefined",
            },
          },
        },
      });
      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.findFirst({
          where: {
            IDDCoordinatorSuggestion: {
              DeanEndorsement: {
                id: {
                  equals: deanEndorsement?.id ?? "undefined",
                },
              },
            },
          },
        });

      const cITLRevision = await prisma.cITLRevision.findFirst({
        where: {
          returned: false,
          SubmittedIDDCoordinatorSuggestion: {
            id: {
              equals: submittedIDDCoordinatorSuggestion?.id ?? "undefined",
            },
          },
        },
      });

      const iDDCoordinatorEndorsement =
        await prisma.iDDCoordinatorEndorsement.findFirst({
          where: {
            CITLRevision: {
              id: {
                equals: cITLRevision?.id ?? "undefined",
              },
            },
          },
        });

      const cITLDirectorEndorsement =
        await prisma.cITLDirectorEndorsement.findFirst({
          where: {
            IDDCoordinatorEndorsement: {
              id: {
                equals: iDDCoordinatorEndorsement?.id ?? "undefined",
              },
            },
          },
        });

      const qAMISRevision = await prisma.qAMISRevision.findFirst({
        where: {
          SubmittedQAMISSuggestion: {
            QAMISSuggestion: {
              CITLDirectorEndorsement: {
                id: {
                  equals: cITLDirectorEndorsement?.id ?? "undefined",
                },
              },
            },
          },
        },
      });

      const qAMISDepartmentEndorsement =
        await prisma.qAMISDepartmentEndorsement.findFirst({
          where: {
            AND: [
              {
                QAMISChairpersonEndorsement: {
                  QAMISRevision: {
                    id: {
                      equals: qAMISRevision?.id ?? "undefined",
                    },
                  },
                },
              },
              {
                QAMISCoordinatorEndorsement: {
                  QAMISRevision: {
                    id: {
                      equals: qAMISRevision?.id ?? "undefined",
                    },
                  },
                },
              },
              {
                QAMISDeanEndorsement: {
                  QAMISRevision: {
                    id: {
                      equals: qAMISRevision?.id ?? "undefined",
                    },
                  },
                },
              },
            ],
          },
        });

      const iMERCCITLReviewed = await prisma.iMERCCITLReviewed.findFirst({
        where: {
          AND: [
            {
              SubmittedContentEditorSuggestion: {
                ContentEditorSuggestion: {
                  ContentEditorReview: {
                    QAMISDepartmentEndorsement: {
                      id: {
                        equals: qAMISDepartmentEndorsement?.id ?? "undefined",
                      },
                    },
                  },
                },
              },
            },
            {
              SubmittedContentSpecialistSuggestion: {
                ContentSpecialistSuggestion: {
                  ContentSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      id: {
                        equals: qAMISDepartmentEndorsement?.id ?? "undefined",
                      },
                    },
                  },
                },
              },
            },
            {
              SubmittedIDDSpecialistSuggestion: {
                IDDSpecialistSuggestion: {
                  IDDSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      id: {
                        equals: qAMISDepartmentEndorsement?.id ?? "undefined",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      });

      console.log({
        id,
        iMERCCITLReviewed,
        qAMISDepartmentEndorsement,
        qAMISRevision,
        cITLDirectorEndorsement,
      });

      /**
       * Status list:
       * IMPLEMENTATION_DEPARTMENT_REVIEWED - IM is submitted for department review and has been reviewed by peer, coordinator and coordinator
       * IMPLEMENTATION_DEPARTMENT_REVIEW - IM is submitted for department review
       * IMPLEMENTATION_DRAFT - IM is created but not yet submitted for review.
       */
      if (iMERCCITLReviewed) {
        return res.send("IMERC_CITL_REVIEWED");
      } else if (qAMISDepartmentEndorsement) {
        return res.send("IMERC_QAMIS_DEPARTMENT_ENDORSED");
      } else if (qAMISRevision) {
        return res.send("IMERC_QAMIS_REVISED");
      } else if (cITLDirectorEndorsement) {
        return res.send("IMPLEMENTATION_CITL_DIRECTOR_ENDORSED");
      } else if (iDDCoordinatorEndorsement) {
        return res.send("IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED");
      } else if (cITLRevision) {
        return res.send("IMPLEMENTATION_CITL_REVISED");
      } else if (submittedIDDCoordinatorSuggestion) {
        return res.send("IMPLEMENTATION_CITL_REVIEWED");
      } else if (deanEndorsement) {
        return res.send("IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED");
      } else if (coordinatorEndorsement) {
        return res.send("IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED");
      } else if (departmentRevision) {
        return res.send("IMPLEMENTATION_DEPARTMENT_REVISED");
      } else if (departmentReviewed) {
        return res.send("IMPLEMENTATION_DEPARTMENT_REVIEWED");
      } else if (departmentReview) {
        return res.send("IMPLEMENTATION_DEPARTMENT_REVIEW");
      } else {
        return res.send("IMPLEMENTATION_DRAFT");
      }
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
