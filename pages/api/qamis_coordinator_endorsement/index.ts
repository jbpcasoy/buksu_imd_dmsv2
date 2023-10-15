import prisma from "@/prisma/client";
import qAMISCoordinatorEndorsementAbility from "@/services/ability/qAMISCoordinatorEndorsementAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = qAMISCoordinatorEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        qAMISRevisionId: Yup.string().required(),
        activeCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "QAMISCoordinatorEndorsement"
      );

      const { qAMISRevisionId, activeCoordinatorId } = validator.cast(
        req.body
      );

      const coordinator = await prisma.coordinator.findFirstOrThrow({
        where: {
          ActiveCoordinator: {
            id: {
              equals: activeCoordinatorId,
            },
          },
        },
      });

      const qAMISCoordinatorEndorsement = await prisma.qAMISCoordinatorEndorsement.create(
        {
          data: {
            Coordinator: {
              connect: {
                id: coordinator.id,
              },
            },
            QAMISRevision: {
              connect: {
                id: qAMISRevisionId,
              },
            },
          },
        }
      );

      const qAMISChairpersonEndorsement =
        await prisma.qAMISChairpersonEndorsement.findFirst({
          where: {
            QAMISRevision: {
              QAMISCoordinatorEndorsement: {
                id: {
                  equals: qAMISCoordinatorEndorsement.id,
                },
              },
            },
          },
        });

      const qAMISDeanEndorsement = await prisma.qAMISDeanEndorsement.findFirst({
        where: {
          QAMISRevision: {
            QAMISCoordinatorEndorsement: {
              id: {
                equals: qAMISCoordinatorEndorsement.id,
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

      return res.json(qAMISCoordinatorEndorsement);
    } catch (error: any) {
      console.error(error);
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
      const qAMISCoordinatorEndorsements =
        await prisma.qAMISCoordinatorEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).QAMISCoordinatorEndorsement],
          },
        });
      const count = await prisma.qAMISCoordinatorEndorsement.count({
        where: {
          AND: [accessibleBy(ability).QAMISCoordinatorEndorsement],
        },
      });

      return res.json({ qAMISCoordinatorEndorsements, count });
    } catch (error: any) {
      console.error(error);
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