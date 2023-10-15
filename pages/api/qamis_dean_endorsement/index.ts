import prisma from "@/prisma/client";
import qAMISDeanEndorsementAbility from "@/services/ability/qAMISDeanEndorsementAbility";
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
  const ability = qAMISDeanEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        qAMISRevisionId: Yup.string().required(),
        activeDeanId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "QAMISDeanEndorsement"
      );

      const { qAMISRevisionId, activeDeanId } = validator.cast(req.body);

      const dean = await prisma.dean.findFirstOrThrow({
        where: {
          ActiveDean: {
            id: {
              equals: activeDeanId,
            },
          },
        },
      });

      const qAMISDeanEndorsement = await prisma.qAMISDeanEndorsement.create({
        data: {
          Dean: {
            connect: {
              id: dean.id,
            },
          },
          QAMISRevision: {
            connect: {
              id: qAMISRevisionId,
            },
          },
        },
      });

      const qAMISChairpersonEndorsement =
        await prisma.qAMISChairpersonEndorsement.findFirst({
          where: {
            QAMISRevision: {
              QAMISDeanEndorsement: {
                id: {
                  equals: qAMISDeanEndorsement.id,
                },
              },
            },
          },
        });

      const qAMISCoordinatorEndorsement =
        await prisma.qAMISCoordinatorEndorsement.findFirst({
          where: {
            QAMISRevision: {
              QAMISDeanEndorsement: {
                id: {
                  equals: qAMISDeanEndorsement.id,
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

      return res.json(qAMISDeanEndorsement);
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
      const qAMISDeanEndorsements = await prisma.qAMISDeanEndorsement.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).QAMISDeanEndorsement],
        },
      });
      const count = await prisma.qAMISDeanEndorsement.count({
        where: {
          AND: [accessibleBy(ability).QAMISDeanEndorsement],
        },
      });

      return res.json({ qAMISDeanEndorsements, count });
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
