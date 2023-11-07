import prisma from "@/prisma/client";
import submittedContentSpecialistSuggestionAbility from "@/services/ability/submittedContentSpecialistSuggestionAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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
  const ability = submittedContentSpecialistSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        contentSpecialistSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedContentSpecialistSuggestion"
      );
      const { contentSpecialistSuggestionId } = validator.cast(req.body);
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
          where: {
            AND: [accessibleBy(ability).SubmittedContentSpecialistSuggestion],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedContentSpecialistSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedContentSpecialistSuggestion],
        },
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
