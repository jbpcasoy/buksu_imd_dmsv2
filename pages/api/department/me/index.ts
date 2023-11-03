import prisma from "@/prisma/client";
import departmentAbility from "@/services/ability/departmentAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const ability = departmentAbility({ user });

  const getHandler = async () => {
    try {
      const department = await prisma.department.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).Department,
            {
              Faculty: {
                some: {
                  ActiveFaculty: {
                    Faculty: {
                      User: {
                        id: user.id,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      });

      return res.json(department);
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
