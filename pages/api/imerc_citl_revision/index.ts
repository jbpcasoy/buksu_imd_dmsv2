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
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IMERCCITLRevision"
      );

      const { iMFileId } = validator.cast(req.body);

      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          id: {
            equals: iMFileId,
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
                returned: {
                  equals: false,
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
          IMFile: {
            connect: {
              id: iMFileId,
            },
          },
          IMERCCITLReviewed: {
            connect: {
              id: iMERCCITLReviewed.id,
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
