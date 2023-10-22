import prisma from "@/prisma/client";
import activeContentSpecialistAbility from "@/services/ability/activeContentSpecialistAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";

import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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

  let ability = activeContentSpecialistAbility({ user });

  const getHandler = async () => {
    try {
      const activeContentSpecialist =
        await prisma.activeContentSpecialist.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ActiveContentSpecialist,
              {
                ContentSpecialist: {
                  Faculty: {
                    User: {
                      id: user.id,
                    },
                  },
                },
              },
            ],
          },
        });

      return res.json(activeContentSpecialist);
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
