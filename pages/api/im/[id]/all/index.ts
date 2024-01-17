import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { Prisma, User } from "@prisma/client";
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
    try {
      const { id } = req.query;

      const qAMISDepartmentEndorsed: Prisma.QAMISDepartmentEndorsementInclude =
        {
          ContentSpecialistReview: {
            include: {
              ContentSpecialistSuggestion: {
                include: {
                  ContentSpecialistSuggestionItem: {
                    include: {
                      ContentSpecialistSuggestionItemActionTaken: true,
                    },
                  },
                  SubmittedContentSpecialistSuggestion: {
                    include: {
                      IMERCCITLReviewed: {
                        include: {
                          PlagiarismFile: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          IDDSpecialistReview: {
            include: {
              IDDSpecialistSuggestion: {
                include: {
                  IDDSpecialistSuggestionItem: {
                    include: {
                      IDDSpecialistSuggestionItemActionTaken: true,
                    },
                  },
                  SubmittedIDDSpecialistSuggestion: {
                    include: {
                      IMERCCITLReviewed: {
                        include: {
                          PlagiarismFile: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          ContentEditorReview: {
            include: {
              ContentEditorSuggestion: {
                include: {
                  ContentEditorSuggestionItem: {
                    include: {
                      ContentEditorSuggestionItemActionTaken: true,
                    },
                  },
                  SubmittedContentEditorSuggestion: {
                    include: {
                      IMERCCITLReviewed: {
                        include: {
                          PlagiarismFile: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };

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
        include: {
          Faculty: true,
          IMFile: {
            orderBy: {
              updatedAt: "desc",
            },
            include: {
              DepartmentReview: {
                include: {
                  ChairpersonReview: {
                    include: {
                      Chairperson: true,
                      ChairpersonSuggestion: {
                        include: {
                          ChairpersonSuggestionItem: {
                            include: {
                              ChairpersonSuggestionItemActionTaken: true,
                            },
                          },
                          SubmittedChairpersonSuggestion: {
                            include: {
                              DepartmentReviewed: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  CoordinatorReview: {
                    include: {
                      Coordinator: true,
                      CoordinatorSuggestion: {
                        include: {
                          CoordinatorSuggestionItem: {
                            include: {
                              CoordinatorSuggestionItemActionTaken: true,
                            },
                          },
                          SubmittedCoordinatorSuggestion: {
                            include: {
                              DepartmentReviewed: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  PeerReview: {
                    include: {
                      Faculty: true,
                      PeerSuggestion: {
                        include: {
                          PeerSuggestionItem: {
                            include: {
                              PeerSuggestionItemActionTaken: true,
                            },
                          },
                          SubmittedPeerSuggestion: {
                            include: {
                              DepartmentReviewed: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              DepartmentRevision: {
                include: {
                  ReturnedDepartmentRevision: {
                    include: {
                      ReturnedDepartmentRevisionSuggestionItem: {
                        include: {
                          ReturnedDepartmentRevisionSuggestionItemActionTaken:
                            true,
                        },
                      },
                      SubmittedReturnedDepartmentRevision: {
                        include: {
                          IMFile: true,
                        },
                      },
                    },
                  },
                  CoordinatorEndorsement: {
                    include: {
                      DeanEndorsement: {
                        include: {
                          IDDCoordinatorSuggestion: {
                            include: {
                              IDDCoordinatorSuggestionItem: {
                                include: {
                                  IDDCoordinatorSuggestionItemActionTaken: true,
                                },
                              },
                              SubmittedIDDCoordinatorSuggestion: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              CITLRevision: {
                include: {
                  ReturnedCITLRevision: {
                    include: {
                      ReturnedCITLRevisionSuggestionItem: {
                        include: {
                          ReturnedCITLRevisionSuggestionItemActionTaken: true,
                        },
                      },
                      SubmittedReturnedCITLRevision: true,
                    },
                  },
                  IDDCoordinatorEndorsement: {
                    include: {
                      CITLDirectorEndorsement: {
                        include: {
                          QAMISSuggestion: {
                            include: {
                              QAMISSuggestionItem: true,
                              SubmittedQAMISSuggestion: {
                                include: {
                                  QAMISFile: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              QAMISRevision: {
                include: {
                  QAMISChairpersonEndorsement: {
                    include: {
                      QAMISDepartmentEndorsement: {
                        include: qAMISDepartmentEndorsed,
                      },
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    include: {
                      QAMISDepartmentEndorsement: {
                        include: qAMISDepartmentEndorsed,
                      },
                    },
                  },
                  QAMISDeanEndorsement: {
                    include: {
                      QAMISDepartmentEndorsement: {
                        include: qAMISDepartmentEndorsed,
                      },
                    },
                  },
                },
              },
              IMERCCITLRevision: {
                include: {
                  ReturnedIMERCCITLRevision: {
                    include: {
                      ReturnedIMERCCITLRevisionSuggestionItem: {
                        include: {
                          ReturnedIMERCCITLRevisionSuggestionItemActionTaken:
                            true,
                        },
                      },
                      SubmittedReturnedIMERCCITLRevision: true,
                    },
                  },
                  IMERCIDDCoordinatorEndorsement: {
                    include: {
                      IMERCCITLDirectorEndorsement: true,
                    },
                  },
                },
              },
              DepartmentReviewed: true,
              IMERCCITLReviewed: true,
              SubmittedIDDCoordinatorSuggestion: true,
              SubmittedQAMISSuggestion: true,
              SubmittedReturnedCITLRevision: true,
              SubmittedReturnedDepartmentRevision: true,
              SubmittedReturnedIMERCCITLRevision: true,
            },
          },
        },
      });

      return res.json(iM);
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
