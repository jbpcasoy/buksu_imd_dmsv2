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
        coordinatorSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { coordinatorSuggestionId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const coordinator = await prisma.coordinator.findFirst({
          where: {
            ActiveCoordinator: {
              Coordinator: {
                Faculty: {
                  User: {
                    id: user.id,
                  },
                },
              },
            },
          },
        });
        if (!coordinator) {
          return res.status(403).json({
            error: {
              message: "Only an active coordinator can perform this action",
            },
          });
        }

        const coordinatorReview =
          await prisma.coordinatorReview.findFirstOrThrow({
            where: {
              CoordinatorSuggestion: {
                id: {
                  equals: coordinatorSuggestionId,
                },
              },
            },
          });
        if (coordinatorReview.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to submit this coordinator suggestion",
            },
          });
        }
      }

      const coordinatorSuggestionItemCount =
        await prisma.coordinatorSuggestionItem.count({
          where: {
            coordinatorSuggestionId: {
              equals: coordinatorSuggestionId,
            },
          },
        });
      if (coordinatorSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
      }

      const submittedCoordinatorSuggestion =
        await prisma.submittedCoordinatorSuggestion.create({
          data: {
            CoordinatorSuggestion: {
              connect: {
                id: coordinatorSuggestionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_COORDINATOR_SUGGESTION_CREATED",
              },
            },
          },
        });

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              PeerReview: {
                DepartmentReview: {
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        id: {
                          equals: submittedCoordinatorSuggestion.id,
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
                  CoordinatorReview: {
                    CoordinatorSuggestion: {
                      SubmittedCoordinatorSuggestion: {
                        id: {
                          equals: submittedCoordinatorSuggestion.id,
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

      return res.json(submittedCoordinatorSuggestion);
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
      const submittedCoordinatorSuggestions =
        await prisma.submittedCoordinatorSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedCoordinatorSuggestion.count({
        where: {},
      });

      return res.json({ submittedCoordinatorSuggestions, count });
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
