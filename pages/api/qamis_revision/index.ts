import prisma from "@/prisma/client";
import qAMISRevisionAbility from "@/services/ability/qAMISRevisionAbility";
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
  const ability = qAMISRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        qAMISFileId: Yup.string().required(),
        iMFileId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "QAMISRevision");

      const { qAMISFileId, iMFileId } = validator.cast(req.body);

      const qAMISFile = await prisma.qAMISFile.findFirstOrThrow({
        where: {
          id: {
            equals: qAMISFileId,
          },
        },
      });

      const submittedQAMISSuggestion =
        await prisma.submittedQAMISSuggestion.findFirstOrThrow({
          where: {
            QAMISFile: {
              some: {
                id: {
                  equals: qAMISFile.id,
                },
              },
            },
          },
        });

      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          CITLRevision: {
            IDDCoordinatorEndorsement: {
              CITLDirectorEndorsement: {
                QAMISSuggestion: {
                  SubmittedQAMISSuggestion: {
                    id: {
                      equals: submittedQAMISSuggestion.id,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const existingQAMISRevision = await prisma.qAMISRevision.findFirst({
        where: {
          AND: [
            {
              QAMISFile: {
                id: {
                  equals: qAMISFile.id,
                },
              },
            },
            {
              SubmittedQAMISSuggestion: {
                id: {
                  equals: submittedQAMISSuggestion.id,
                },
              },
            },
          ],
        },
      });

      if (existingQAMISRevision) {
        return res.status(400).json({
          error: { message: "IM has already been submitted for endorsement" },
        });
      }

      const qAMISRevision = await prisma.qAMISRevision.create({
        data: {
          IMFile: {
            connect: {
              id: iMFileId,
            },
          },
          QAMISFile: {
            connect: {
              id: qAMISFileId,
            },
          },
          SubmittedQAMISSuggestion: {
            connect: {
              id: submittedQAMISSuggestion.id,
            },
          },
          Event: {
            create: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              type: "QAMIS_REVISION_CREATED",
            },
          },
        },
      });

      return res.json(qAMISRevision);
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

      const { skip, take } = validator.cast(req.query);
      const qAMISRevisions = await prisma.qAMISRevision.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).QAMISRevision],
        },
      });
      const count = await prisma.qAMISRevision.count({
        where: {
          AND: [accessibleBy(ability).QAMISRevision],
        },
      });

      return res.json({ qAMISRevisions, count });
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
