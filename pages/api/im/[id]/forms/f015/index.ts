import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { F015Props, F015Suggestion } from "@/types/forms";
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
    const { id } = req.query;

    try {
      const iM = await prisma.iM.findUniqueOrThrow({
        where: {
          id: id as string,
        },
      });

      const iMAuthor = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              IM: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        },
      });

      const coAuthors = await prisma.coAuthor.findMany({
        where: {
          IM: {
            id: {
              equals: id as string,
            },
          },
        },
      });
      const authorNames: string[] = [];
      authorNames.push(iMAuthor?.name ?? "");
      for (let coAuthor of coAuthors) {
        const coAuthorUser = await prisma.user.findFirstOrThrow({
          where: {
            Faculty: {
              some: {
                id: {
                  equals: coAuthor.facultyId,
                },
              },
            },
          },
        });

        if (coAuthorUser?.name) {
          authorNames.push(coAuthorUser?.name);
        }
      }

      const department = await prisma.department.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              IM: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        },
      });

      const coordinatorUser = await prisma.user.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              Coordinator: {
                AND: [
                  {
                    ActiveCoordinator: {
                      isNot: null,
                    },
                  },
                  {
                    Faculty: {
                      Department: {
                        id: {
                          equals: department.id,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      });

      const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
        where: {
          IDDCoordinator: {
            ActiveIDDCoordinator: {
              isNot: null,
            },
          },
        },
      });

      const qAMISReview: F015Suggestion[] = [];
      const qAMISSuggestionItems = await prisma.qAMISSuggestionItem.findMany({
        where: {
          QAMISSuggestion: {
            SubmittedQAMISSuggestion: {
              QAMISSuggestion: {
                CITLDirectorEndorsement: {
                  IDDCoordinatorEndorsement: {
                    CITLRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
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
      for (let qAMISSuggestionItem of qAMISSuggestionItems) {
        qAMISReview.push({
          actionTaken: qAMISSuggestionItem.actionTaken ?? "",
          pageNumber: qAMISSuggestionItem.pageNumber,
          remarks: qAMISSuggestionItem.remarks ?? "",
          suggestion: qAMISSuggestionItem.suggestion,
        });
      }

      const iMERCReview: F015Suggestion[] = [];
      const contentSpecialistSuggestionItems =
        await prisma.contentSpecialistSuggestionItem.findMany({
          where: {
            ContentSpecialistSuggestion: {
              SubmittedContentSpecialistSuggestion: {
                ContentSpecialistSuggestion: {
                  ContentSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      QAMISDeanEndorsement: {
                        QAMISRevision: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
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
      for (let contentSpecialistSuggestionItem of contentSpecialistSuggestionItems) {
        const actionTaken =
          await prisma.contentSpecialistSuggestionItemActionTaken.findFirst(
            {
              where: {
                ContentSpecialistSuggestionItem: {
                  id: {
                    equals: contentSpecialistSuggestionItem.id,
                  },
                },
              },
            }
          );
        iMERCReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: contentSpecialistSuggestionItem.pageNumber,
          remarks: contentSpecialistSuggestionItem.remarks ?? "",
          suggestion: contentSpecialistSuggestionItem.suggestion,
        });
      }
      const iDDSpecialistSuggestionItems =
        await prisma.iDDSpecialistSuggestionItem.findMany({
          where: {
            IDDSpecialistSuggestion: {
              SubmittedIDDSpecialistSuggestion: {
                IDDSpecialistSuggestion: {
                  IDDSpecialistReview: {
                    QAMISDepartmentEndorsement: {
                      QAMISDeanEndorsement: {
                        QAMISRevision: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
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
      for (let iDDSpecialistSuggestionItem of iDDSpecialistSuggestionItems) {
        const actionTaken =
          await prisma.iDDSpecialistSuggestionItemActionTaken.findFirst({
            where: {
              IDDSpecialistSuggestionItem: {
                id: {
                  equals: iDDSpecialistSuggestionItem.id,
                },
              },
            },
          });
        iMERCReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: iDDSpecialistSuggestionItem.pageNumber,
          remarks: iDDSpecialistSuggestionItem.remarks ?? "",
          suggestion: iDDSpecialistSuggestionItem.suggestion,
        });
      }

      const contentEditorSuggestionItems =
        await prisma.contentEditorSuggestionItem.findMany({
          where: {
            ContentEditorSuggestion: {
              SubmittedContentEditorSuggestion: {
                ContentEditorSuggestion: {
                  ContentEditorReview: {
                    QAMISDepartmentEndorsement: {
                      QAMISDeanEndorsement: {
                        QAMISRevision: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
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
      for (let contentEditorSuggestionItem of contentEditorSuggestionItems) {
        const actionTaken =
          await prisma.contentEditorSuggestionItemActionTaken.findFirst({
            where: {
              ContentEditorSuggestionItem: {
                id: {
                  equals: contentEditorSuggestionItem.id,
                },
              },
            },
          });
        iMERCReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: contentEditorSuggestionItem.pageNumber,
          remarks: contentEditorSuggestionItem.remarks ?? "",
          suggestion: contentEditorSuggestionItem.suggestion,
        });
      }

      const returnedIMERCCITLRevisionSuggestionItems =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.findMany({
          where: {
            ReturnedIMERCCITLRevision: {
              SubmittedReturnedIMERCCITLRevision: {
                ReturnedIMERCCITLRevision: {
                  IMERCCITLRevision: {
                    IMFile: {
                      IM: {
                        id: {
                          equals: id as string,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      for (let returnedIMERCCITLRevisionSuggestionItem of returnedIMERCCITLRevisionSuggestionItems) {
        const actionTaken =
          await prisma.returnedCITLRevisionSuggestionItemActionTaken.findFirst(
            {
              where: {
                ReturnedCITLRevisionSuggestionItem: {
                  id: {
                    equals: returnedIMERCCITLRevisionSuggestionItem.id,
                  },
                },
              },
            }
          );
        iMERCReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: returnedIMERCCITLRevisionSuggestionItem.pageNumber,
          remarks: returnedIMERCCITLRevisionSuggestionItem.remarks ?? "",
          suggestion: returnedIMERCCITLRevisionSuggestionItem.suggestion,
        });
      }

      const response: F015Props = {
        iMTitle: iM.title,
        coordinatorName: coordinatorUser.name ?? "",
        iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
        authorName: iMAuthor.name ?? "",
        iMERCReview,
        programName: department.name,
        qAMISReview,
      };

      return res.json(response);
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
