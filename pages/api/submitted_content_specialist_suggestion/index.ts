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
        contentSpecialistSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { contentSpecialistSuggestionId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const contentSpecialistReview =
          await prisma.contentSpecialistReview.findFirstOrThrow({
            where: {
              ContentSpecialistSuggestion: {
                id: {
                  equals: contentSpecialistSuggestionId,
                },
              },
            },
          });

        const contentSpecialist = await prisma.contentSpecialist.findFirst({
          where: {
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
        });
        if (!contentSpecialist) {
          return res.status(403).json({
            error: {
              message:
                "Only an active content specialist can perform this action",
            },
          });
        }

        if (
          contentSpecialistReview.contentSpecialistId !== contentSpecialist.id
        ) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to submit this content specialist suggestion",
            },
          });
        }
      }

      const contentSpecialistSuggestionItemCount =
        await prisma.contentSpecialistSuggestionItem.count({
          where: {
            contentSpecialistSuggestionId: {
              equals: contentSpecialistSuggestionId,
            },
          },
        });
      if (contentSpecialistSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
      }
      const submittedContentSpecialistSuggestion =
        await prisma.submittedContentSpecialistSuggestion.create({
          data: {
            ContentSpecialistSuggestion: {
              connect: {
                id: contentSpecialistSuggestionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_CONTENT_SPECIALIST_SUGGESTION_CREATED",
              },
            },
          },
        });

      const submittedContentEditorSuggestion =
        await prisma.submittedContentEditorSuggestion.findFirst({
          where: {
            ContentEditorSuggestion: {
              ContentEditorReview: {
                QAMISDepartmentEndorsement: {
                  ContentSpecialistReview: {
                    ContentSpecialistSuggestion: {
                      SubmittedContentSpecialistSuggestion: {
                        id: {
                          equals: submittedContentSpecialistSuggestion.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const submittedIDDSpecialistSuggestion =
        await prisma.submittedIDDSpecialistSuggestion.findFirst({
          where: {
            IDDSpecialistSuggestion: {
              IDDSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  ContentSpecialistReview: {
                    ContentSpecialistSuggestion: {
                      SubmittedContentSpecialistSuggestion: {
                        id: {
                          equals: submittedContentSpecialistSuggestion.id,
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
        submittedContentEditorSuggestion &&
        submittedContentSpecialistSuggestion &&
        submittedIDDSpecialistSuggestion
      ) {
        await prisma.iMERCCITLReviewed.create({
          data: {
            SubmittedIDDSpecialistSuggestion: {
              connect: {
                id: submittedIDDSpecialistSuggestion.id,
              },
            },
            SubmittedContentSpecialistSuggestion: {
              connect: {
                id: submittedContentSpecialistSuggestion.id,
              },
            },
            SubmittedContentEditorSuggestion: {
              connect: {
                id: submittedContentEditorSuggestion.id,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "IMERC_CITL_REVIEWED_CREATED",
              },
            },
          },
        });

        const iM = await prisma.iM.findFirst({
          where: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentEditorReview: {
                        ContentEditorSuggestion: {
                          SubmittedContentEditorSuggestion: {
                            id: {
                              equals: submittedContentEditorSuggestion.id,
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
              subject: "IM IMERC Review",
              text: `We are pleased to inform you that the IMERC review process for your IM titled "${iM?.title}" has been successfully completed and is now ready for your revision.`,
              to: iMOwner.email,
            },
            (err) => {
              logger.error(err);
            }
          );
        }
      }

      return res.json(submittedContentSpecialistSuggestion);
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

      const submittedContentSpecialistSuggestions =
        await prisma.submittedContentSpecialistSuggestion.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedContentSpecialistSuggestion.count({
        where: {},
      });

      return res.json({ submittedContentSpecialistSuggestions, count });
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
