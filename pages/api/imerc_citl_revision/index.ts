import prisma from "@/prisma/client";
import iMERCCITLRevisionAbility from "@/services/ability/iMERCCITLRevisionAbility";
import userAbility from "@/services/ability/userAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { PrismaClient, User } from "@prisma/client";
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
  const ability = iMERCCITLRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMFileId: Yup.string().required(),
        plagiarismFileId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IMERCCITLRevision"
      );

      const { iMFileId, plagiarismFileId } = validator.cast(req.body);

      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          id: {
            equals: iMFileId,
          },
        },
      });
      const plagiarismFile = await prisma.plagiarismFile.findFirstOrThrow({
        where: {
          id: {
            equals: plagiarismFileId,
          },
        },
      });

      const qAMISDepartmentEndorsement =
        await prisma.qAMISDepartmentEndorsement.findFirstOrThrow({
          where: {
            QAMISCoordinatorEndorsement: {
              QAMISRevision: {
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
        });

      const submittedContentSpecialistSuggestion =
        await prisma.submittedContentSpecialistSuggestion.findFirstOrThrow({
          where: {
            ContentSpecialistSuggestion: {
              ContentSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  id: {
                    equals: qAMISDepartmentEndorsement.id,
                  },
                },
              },
            },
          },
        });
      const blank_content_specialist_suggestion =
        await prisma.contentSpecialistSuggestionItem.count({
          where: {
            ContentSpecialistSuggestion: {
              SubmittedContentSpecialistSuggestion: {
                id: {
                  equals: submittedContentSpecialistSuggestion.id,
                },
              },
            },
            actionTaken: {
              equals: null,
            },
          },
        });
      if (blank_content_specialist_suggestion > 0) {
        return res.status(400).json({
          error: {
            message:
              "Action taken must be filled in content specialist suggestions",
          },
        });
      }

      const submittedContentEditorSuggestion =
        await prisma.submittedContentEditorSuggestion.findFirstOrThrow({
          where: {
            ContentEditorSuggestion: {
              ContentEditorReview: {
                QAMISDepartmentEndorsement: {
                  id: {
                    equals: qAMISDepartmentEndorsement.id,
                  },
                },
              },
            },
          },
        });
      const blank_content_editor_suggestion =
        await prisma.contentEditorSuggestionItem.count({
          where: {
            ContentEditorSuggestion: {
              SubmittedContentEditorSuggestion: {
                id: {
                  equals: submittedContentEditorSuggestion.id,
                },
              },
            },
            actionTaken: {
              equals: null,
            },
          },
        });
      if (blank_content_editor_suggestion > 0) {
        return res.status(400).json({
          error: {
            message:
              "Action taken must be filled in content editor suggestions",
          },
        });
      }

      const submittedIDDSpecialistSuggestion =
        await prisma.submittedIDDSpecialistSuggestion.findFirstOrThrow({
          where: {
            IDDSpecialistSuggestion: {
              IDDSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  id: {
                    equals: qAMISDepartmentEndorsement.id,
                  },
                },
              },
            },
          },
        });
      const blank_idd_specialist_suggestion =
        await prisma.iDDSpecialistSuggestionItem.count({
          where: {
            IDDSpecialistSuggestion: {
              SubmittedIDDSpecialistSuggestion: {
                id: {
                  equals: submittedIDDSpecialistSuggestion.id,
                },
              },
            },
            actionTaken: {
              equals: null,
            },
          },
        });
      if (blank_idd_specialist_suggestion > 0) {
        return res.status(400).json({
          error: {
            message:
              "Action taken must be filled in idd specialist suggestions",
          },
        });
      }

      const iMERCCITLReviewed = await prisma.iMERCCITLReviewed.findFirstOrThrow(
        {
          where: {
            SubmittedContentEditorSuggestion: {
              id: {
                equals: submittedContentEditorSuggestion.id,
              },
            },
            SubmittedContentSpecialistSuggestion: {
              id: {
                equals: submittedContentSpecialistSuggestion.id,
              },
            },
            SubmittedIDDSpecialistSuggestion: {
              id: {
                equals: submittedIDDSpecialistSuggestion.id,
              },
            },
          },
        }
      );

      const existingIMERCCITLRevision =
        await prisma.iMERCCITLRevision.findFirst({
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
                ReturnedIMERCCITLRevision: {
                  is: null,
                },
              },
            ],
          },
        });

      if (existingIMERCCITLRevision) {
        return res.status(400).json({
          error: { message: "IM has already been submitted for endorsement" },
        });
      }

      const iMERCCITLRevision = await prisma.iMERCCITLRevision.create({
        data: {
          PlagiarismFile: {
            connect: {
              id: plagiarismFile.id,
            },
          },
          IMFile: {
            connect: {
              id: iMFile.id,
            },
          },
          IMERCCITLReviewed: {
            connect: {
              id: iMERCCITLReviewed.id,
            },
          },
          Event: {
            create: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              type: "IMERC_CITL_REVISION_CREATED",
            },
          },
        },
      });

      return res.json(iMERCCITLRevision);
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

      const iMERCCITLRevisions = await prisma.iMERCCITLRevision.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).IMERCCITLRevision],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.iMERCCITLRevision.count({
        where: {
          AND: [accessibleBy(ability).IMERCCITLRevision],
        },
      });

      return res.json({ iMERCCITLRevisions, count });
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
