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
        chairpersonSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { chairpersonSuggestionId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const chairperson = await prisma.chairperson.findFirst({
          where: {
            ActiveChairperson: {
              Chairperson: {
                Faculty: {
                  User: {
                    id: user.id,
                  },
                },
              },
            },
          },
        });
        if (!chairperson) {
          return res.status(403).json({
            error: {
              message: "Only an active chairperson can perform this action",
            },
          });
        }

        const chairpersonReview =
          await prisma.chairpersonReview.findFirstOrThrow({
            where: {
              ChairpersonSuggestion: {
                id: {
                  equals: chairpersonSuggestionId,
                },
              },
            },
          });
        if (chairpersonReview.chairpersonId !== chairperson.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to submit this chairperson suggestion",
            },
          });
        }
      }

      const chairpersonSuggestionItemCount =
        await prisma.chairpersonSuggestionItem.count({
          where: {
            chairpersonSuggestionId: {
              equals: chairpersonSuggestionId,
            },
          },
        });
      if (chairpersonSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
      }

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.create({
          data: {
            ChairpersonSuggestion: {
              connect: {
                id: chairpersonSuggestionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED",
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
                  ChairpersonReview: {
                    ChairpersonSuggestion: {
                      SubmittedChairpersonSuggestion: {
                        id: {
                          equals: submittedChairpersonSuggestion.id,
                        },
                      },
                    },
                  },
                },
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
                  ChairpersonReview: {
                    ChairpersonSuggestion: {
                      SubmittedChairpersonSuggestion: {
                        id: {
                          equals: submittedChairpersonSuggestion.id,
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

      return res.json(submittedChairpersonSuggestion);
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
      const submittedChairpersonSuggestions =
        await prisma.submittedChairpersonSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedChairpersonSuggestion.count({
        where: {},
      });

      return res.json({ submittedChairpersonSuggestions, count });
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
