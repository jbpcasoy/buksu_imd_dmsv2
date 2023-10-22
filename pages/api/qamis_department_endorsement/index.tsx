import prisma from "@/prisma/client";
import qAMISDepartmentEndorsementAbility from "@/services/ability/qAMISDepartmentEndorsementAbility";
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

  const ability = qAMISDepartmentEndorsementAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const qAMISDepartmentEndorsements = await prisma.qAMISDepartmentEndorsement.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).QAMISDepartmentEndorsement],
        },
      });
      const count = await prisma.qAMISDepartmentEndorsement.count({
        where: {
          AND: [accessibleBy(ability).QAMISDepartmentEndorsement],
        },
      });

      return res.json({ qAMISDepartmentEndorsements, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
