import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { F003Props, F003Suggestion } from "@/types/forms";
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
                CoordinatorReview: {
                  some: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        CoordinatorSuggestion: {
                          CoordinatorReview: {
                            DepartmentReview: {
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
            },
          },
        },
      });

      const programReview: F003Suggestion[] = [];
      const peerSuggestionItems = await prisma.peerSuggestionItem.findMany({
        where: {
          PeerSuggestion: {
            SubmittedPeerSuggestion: {
              PeerSuggestion: {
                PeerReview: {
                  DepartmentReview: {
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
      });
      for (let peerSuggestionItem of peerSuggestionItems) {
        const actionTaken =
          await prisma.peerSuggestionItemActionTaken.findFirst({
            where: {
              PeerSuggestionItem: {
                id: {
                  equals: peerSuggestionItem.id,
                },
              },
            },
          });
        programReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: peerSuggestionItem.pageNumber,
          remarks: peerSuggestionItem.remarks ?? "",
          suggestion: peerSuggestionItem.suggestion,
        });
      }
      const chairpersonSuggestionItems =
        await prisma.chairpersonSuggestionItem.findMany({
          where: {
            ChairpersonSuggestion: {
              SubmittedChairpersonSuggestion: {
                ChairpersonSuggestion: {
                  ChairpersonReview: {
                    DepartmentReview: {
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
        });
      for (let chairpersonSuggestionItem of chairpersonSuggestionItems) {
        const actionTaken =
          await prisma.chairpersonSuggestionItemActionTaken.findFirst({
            where: {
              ChairpersonSuggestionItem: {
                id: {
                  equals: chairpersonSuggestionItem.id,
                },
              },
            },
          });
        programReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: chairpersonSuggestionItem.pageNumber,
          remarks: chairpersonSuggestionItem.remarks ?? "",
          suggestion: chairpersonSuggestionItem.suggestion,
        });
      }
      const coordinatorSuggestionItems =
        await prisma.coordinatorSuggestionItem.findMany({
          where: {
            CoordinatorSuggestion: {
              SubmittedCoordinatorSuggestion: {
                CoordinatorSuggestion: {
                  CoordinatorReview: {
                    DepartmentReview: {
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
        });
      for (let coordinatorSuggestionItem of coordinatorSuggestionItems) {
        const actionTaken =
          await prisma.coordinatorSuggestionItemActionTaken.findFirst({
            where: {
              CoordinatorSuggestionItem: {
                id: {
                  equals: coordinatorSuggestionItem.id,
                },
              },
            },
          });
        programReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: coordinatorSuggestionItem.pageNumber,
          remarks: coordinatorSuggestionItem.remarks ?? "",
          suggestion: coordinatorSuggestionItem.suggestion,
        });
      }
      const returnedDepartmentRevisionSuggestionItems =
        await prisma.returnedDepartmentRevisionSuggestionItem.findMany({
          where: {
            ReturnedDepartmentRevision: {
              SubmittedReturnedDepartmentRevision: {
                ReturnedDepartmentRevision: {
                  DepartmentRevision: {
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
      for (let returnedDepartmentRevisionSuggestionItem of returnedDepartmentRevisionSuggestionItems) {
        const actionTaken =
          await prisma.returnedDepartmentRevisionSuggestionItemActionTaken.findFirst(
            {
              where: {
                ReturnedDepartmentRevisionSuggestionItem: {
                  id: {
                    equals: returnedDepartmentRevisionSuggestionItem.id,
                  },
                },
              },
            }
          );
        programReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: returnedDepartmentRevisionSuggestionItem.pageNumber,
          remarks: returnedDepartmentRevisionSuggestionItem.remarks ?? "",
          suggestion: returnedDepartmentRevisionSuggestionItem.suggestion,
        });
      }

      const cITLReview = [];
      const iDDCoordinatorSuggestionItems =
        await prisma.iDDCoordinatorSuggestionItem.findMany({
          where: {
            IDDCoordinatorSuggestion: {
              SubmittedIDDCoordinatorSuggestion: {
                IDDCoordinatorSuggestion: {
                  DeanEndorsement: {
                    CoordinatorEndorsement: {
                      DepartmentRevision: {
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
      for (let iDDCoordinatorSuggestionItem of iDDCoordinatorSuggestionItems) {
        const actionTaken =
          await prisma.iDDCoordinatorSuggestionItemActionTaken.findFirst({
            where: {
              IDDCoordinatorSuggestionItem: {
                id: {
                  equals: iDDCoordinatorSuggestionItem.id,
                },
              },
            },
          });
        cITLReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: iDDCoordinatorSuggestionItem.pageNumber,
          remarks: iDDCoordinatorSuggestionItem.remarks ?? "",
          suggestion: iDDCoordinatorSuggestionItem.suggestion,
        });
      }
      const returnedCITLRevisionSuggestionItems =
        await prisma.returnedCITLRevisionSuggestionItem.findMany({
          where: {
            ReturnedCITLRevision: {
              SubmittedReturnedCITLRevision: {
                ReturnedCITLRevision: {
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
        });
      for (let returnedCITLRevisionSuggestionItem of returnedCITLRevisionSuggestionItems) {
        const actionTaken =
          await prisma.returnedCITLRevisionSuggestionItemActionTaken.findFirst({
            where: {
              ReturnedCITLRevisionSuggestionItem: {
                id: {
                  equals: returnedCITLRevisionSuggestionItem.id,
                },
              },
            },
          });
        cITLReview.push({
          actionTaken: actionTaken?.value ?? "",
          pageNumber: returnedCITLRevisionSuggestionItem.pageNumber,
          remarks: returnedCITLRevisionSuggestionItem.remarks ?? "",
          suggestion: returnedCITLRevisionSuggestionItem.suggestion,
        });
      }

      const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
        where: {
          IDDCoordinator: {
            IDDCoordinatorSuggestion: {
              some: {
                SubmittedIDDCoordinatorSuggestion: {
                  IDDCoordinatorSuggestion: {
                    DeanEndorsement: {
                      CoordinatorEndorsement: {
                        DepartmentRevision: {
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
        },
      });

      const cITLDirectorUser = await prisma.user.findFirstOrThrow({
        where: {
          CITLDirector: {
            CITLDirectorEndorsement: {
              some: {
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
      });

      const response: F003Props = {
        iMTitle: iM.title,
        cITLDirectorName: cITLDirectorUser.name ?? "",
        coordinatorName: coordinatorUser.name ?? "",
        iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
        vPAAName: process.env.NEXT_PUBLIC_VPAA_NAME ?? "",
        cITLReview,
        programReview,
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
