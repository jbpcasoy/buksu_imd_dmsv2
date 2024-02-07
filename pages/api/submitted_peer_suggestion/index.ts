import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import mailTransporter from "@/services/mailTransporter";
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
        peerSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { peerSuggestionId } = validator.cast(req.body);

      if (!user.isAdmin) {
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

        const peerReview = await prisma.peerReview.findFirstOrThrow({
          where: {
            PeerSuggestion: {
              id: {
                equals: peerSuggestionId,
              },
            },
          },
        });
        if (peerReview.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to submit this peer suggestion",
            },
          });
        }
      }

      const peerSuggestionItemCount = await prisma.peerSuggestionItem.count({
        where: {
          peerSuggestionId: {
            equals: peerSuggestionId,
          },
        },
      });
      if (peerSuggestionItemCount < 1) {
        return res.status(400).json({
          error: {
            message: "Suggestions are required upon submitting",
          },
        });
      }
      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.create({
          data: {
            PeerSuggestion: {
              connect: {
                id: peerSuggestionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_PEER_SUGGESTION_CREATED",
              },
            },
          },
        });
      const submittedCoordinatorSuggestion =
        await prisma.submittedCoordinatorSuggestion.findFirst({
          where: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  PeerReview: {
                    PeerSuggestion: {
                      SubmittedPeerSuggestion: {
                        id: {
                          equals: submittedPeerSuggestion.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.findFirst({
          where: {
            ChairpersonSuggestion: {
              ChairpersonReview: {
                DepartmentReview: {
                  PeerReview: {
                    PeerSuggestion: {
                      SubmittedPeerSuggestion: {
                        id: {
                          equals: submittedPeerSuggestion.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      if (
        submittedChairpersonSuggestion &&
        submittedPeerSuggestion &&
        submittedCoordinatorSuggestion
      ) {
        await prisma.departmentReviewed.create({
          data: {
            SubmittedChairpersonSuggestion: {
              connect: {
                id: submittedChairpersonSuggestion.id,
              },
            },
            SubmittedCoordinatorSuggestion: {
              connect: {
                id: submittedCoordinatorSuggestion.id,
              },
            },
            SubmittedPeerSuggestion: {
              connect: {
                id: submittedPeerSuggestion.id,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "DEPARTMENT_REVIEWED_CREATED",
              },
            },
          },
        });

        const iM = await prisma.iM.findFirst({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        id: submittedCoordinatorSuggestion.id,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        const iMOwner = await prisma.user.findFirst({
          where: {
            Faculty: {
              some: {
                IM: {
                  some: {
                    id: {
                      equals: iM?.id,
                    },
                  },
                },
              },
            },
          },
        });

        if (iMOwner?.email) {
          mailTransporter.sendMail(
            {
              subject: "IM Department Review",
              text: `We are pleased to inform you that the departmental review process for your IM titled "${iM?.title}" has been successfully completed and is now ready for your revision.`,
              to: iMOwner.email,
            },
            (err) => {
              logger.error(err);
            }
          );
        }
      }

      return res.json(submittedPeerSuggestion);
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
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
      } = validator.cast(req.query);

      const submittedPeerSuggestions =
        await prisma.submittedPeerSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedPeerSuggestion.count({
        where: {},
      });

      return res.json({ submittedPeerSuggestions, count });
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
