import prisma from "@/prisma/client";
import qAMISChairpersonEndorsementAbility from "@/services/ability/qAMISChairpersonEndorsementAbility";
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
  const ability = qAMISChairpersonEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        qAMISRevisionId: Yup.string().required(),
        activeChairpersonId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "QAMISChairpersonEndorsement"
      );

      const { qAMISRevisionId, activeChairpersonId } = validator.cast(req.body);

      const chairperson = await prisma.chairperson.findFirstOrThrow({
        where: {
          ActiveChairperson: {
            id: {
              equals: activeChairpersonId,
            },
          },
        },
      });

      const qAMISChairpersonEndorsement =
        await prisma.qAMISChairpersonEndorsement.create({
          data: {
            Chairperson: {
              connect: {
                id: chairperson.id,
              },
            },
            QAMISRevision: {
              connect: {
                id: qAMISRevisionId,
              },
            },
          },
        });

      const qAMISCoordinatorEndorsement =
        await prisma.qAMISCoordinatorEndorsement.findFirst({
          where: {
            QAMISRevision: {
              QAMISChairpersonEndorsement: {
                id: {
                  equals: qAMISChairpersonEndorsement.id,
                },
              },
            },
          },
        });

      const qAMISDeanEndorsement = await prisma.qAMISDeanEndorsement.findFirst({
        where: {
          QAMISRevision: {
            QAMISChairpersonEndorsement: {
              id: {
                equals: qAMISChairpersonEndorsement.id,
              },
            },
          },
        },
      });

      if (
        qAMISChairpersonEndorsement &&
        qAMISCoordinatorEndorsement &&
        qAMISDeanEndorsement
      ) {
        await prisma.qAMISDepartmentEndorsement.create({
          data: {
            QAMISChairpersonEndorsement: {
              connect: {
                id: qAMISChairpersonEndorsement.id,
              },
            },
            QAMISCoordinatorEndorsement: {
              connect: {
                id: qAMISCoordinatorEndorsement.id,
              },
            },
            QAMISDeanEndorsement: {
              connect: {
                id: qAMISDeanEndorsement.id,
              },
            },
          },
        });
      }

      return res.json(qAMISChairpersonEndorsement);
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
      const qAMISChairpersonEndorsements =
        await prisma.qAMISChairpersonEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).QAMISChairpersonEndorsement],
          },
        });
      const count = await prisma.qAMISChairpersonEndorsement.count({
        where: {
          AND: [accessibleBy(ability).QAMISChairpersonEndorsement],
        },
      });

      return res.json({ qAMISChairpersonEndorsements, count });
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
