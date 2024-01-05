import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMFileId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { iMFileId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                id: {
                  equals: iMFileId,
                },
              },
            },
          },
        });
        const faculty = await prisma.faculty.findFirst({
          where: {
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
        });

        if (!faculty) {
          return res.status(403).json({
            error: {
              message:
                "Only an active faculty is allowed to perform this action",
            },
          });
        }
        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to create this department revision",
            },
          });
        }
      }

      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          id: {
            equals: iMFileId,
          },
        },
      });

      const departmentReview = await prisma.departmentReview.findFirstOrThrow({
        where: {
          IMFile: {
            IM: {
              IMFile: {
                some: {
                  id: {
                    equals: iMFile.id,
                  },
                },
              },
            },
          },
        },
      });

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirstOrThrow({
          where: {
            PeerSuggestion: {
              PeerReview: {
                DepartmentReview: {
                  id: {
                    equals: departmentReview.id,
                  },
                },
              },
            },
          },
        });
      const blank_peer_suggestion_items = await prisma.peerSuggestionItem.count(
        {
          where: {
            PeerSuggestion: {
              SubmittedPeerSuggestion: {
                id: {
                  equals: submittedPeerSuggestion.id,
                },
              },
            },
            PeerSuggestionItemActionTaken: {
              is: null,
            },
          },
        }
      );
      if (blank_peer_suggestion_items > 0) {
        return res.status(400).json({
          error: {
            message: "Action taken must be filled in peer suggestions",
          },
        });
      }

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.findFirstOrThrow({
          where: {
            ChairpersonSuggestion: {
              ChairpersonReview: {
                DepartmentReview: {
                  id: {
                    equals: departmentReview.id,
                  },
                },
              },
            },
          },
        });
      const blank_chairperson_suggestion_items =
        await prisma.chairpersonSuggestionItem.count({
          where: {
            ChairpersonSuggestion: {
              SubmittedChairpersonSuggestion: {
                id: {
                  equals: submittedChairpersonSuggestion.id,
                },
              },
            },
            ChairpersonSuggestionItemActionTaken: {
              is: null,
            },
          },
        });
      if (blank_chairperson_suggestion_items > 0) {
        return res.status(400).json({
          error: {
            message: "Action taken must be filled in chairperson suggestions",
          },
        });
      }

      const submittedCoordinatorSuggestion =
        await prisma.submittedCoordinatorSuggestion.findFirstOrThrow({
          where: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  id: {
                    equals: departmentReview.id,
                  },
                },
              },
            },
          },
        });
      const blank_coordinator_suggestion_items =
        await prisma.coordinatorSuggestionItem.count({
          where: {
            CoordinatorSuggestion: {
              SubmittedCoordinatorSuggestion: {
                id: {
                  equals: submittedCoordinatorSuggestion.id,
                },
              },
            },
            CoordinatorSuggestionItemActionTaken: {
              is: null,
            },
          },
        });

      if (blank_coordinator_suggestion_items > 0) {
        return res.status(400).json({
          error: {
            message: "Action taken must be filled in coordinator suggestions",
          },
        });
      }
      const blank_returned_department_revision_suggestion_items =
        await prisma.returnedDepartmentRevisionSuggestionItem.count({
          where: {
            ReturnedDepartmentRevision: {
              SubmittedReturnedDepartmentRevision: {
                ReturnedDepartmentRevision: {
                  DepartmentRevision: {
                    IMFile: {
                      IM: {
                        id: {
                          equals: iMFile.iMId,
                        },
                      },
                    },
                  },
                },
              },
            },
            ReturnedDepartmentRevisionSuggestionItemActionTaken: {
              is: null,
            },
          },
        });
      if (blank_returned_department_revision_suggestion_items > 0) {
        return res.status(400).json({
          error: {
            message:
              "Action taken must be filled in returned department revision suggestions",
          },
        });
      }

      const departmentReviewed =
        await prisma.departmentReviewed.findFirstOrThrow({
          where: {
            AND: [
              {
                SubmittedChairpersonSuggestion: {
                  id: {
                    equals: submittedChairpersonSuggestion.id,
                  },
                },
              },
              {
                SubmittedCoordinatorSuggestion: {
                  id: {
                    equals: submittedCoordinatorSuggestion.id,
                  },
                },
              },
              {
                SubmittedPeerSuggestion: {
                  id: {
                    equals: submittedPeerSuggestion.id,
                  },
                },
              },
            ],
          },
        });

      const existingDepartmentRevision =
        await prisma.departmentRevision.findFirst({
          where: {
            AND: [
              {
                IMFile: {
                  IM: {
                    id: {
                      equals: iMFile.iMId,
                    },
                  },
                },
              },
              {
                ReturnedDepartmentRevision: {
                  is: null,
                },
              },
            ],
          },
        });

      if (existingDepartmentRevision) {
        return res.status(400).json({
          error: { message: "IM has already been submitted for endorsement" },
        });
      }

      const departmentRevision = await prisma.departmentRevision.create({
        data: {
          IMFile: {
            connect: {
              id: iMFileId,
            },
          },
          DepartmentReviewed: {
            connect: {
              id: departmentReviewed.id,
            },
          },
          Event: {
            create: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              type: "DEPARTMENT_REVISION_CREATED",
            },
          },
        },
      });

      return res.json(departmentRevision);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);

      const departmentRevisions = await prisma.departmentRevision.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.departmentRevision.count({
        where: {},
      });

      return res.json({ departmentRevisions, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "POST":
      return await postHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
