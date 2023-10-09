import prisma from "@/prisma/client";
import activeCoordinatorAbility from "@/services/ability/activeCoordinatorAbility";
import getServerUser from "@/services/getServerUser";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
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

  let ability = activeCoordinatorAbility({ user });

  const getHandler = async () => {
    try {
      const activeCoordinator = await prisma.activeCoordinator.findFirstOrThrow(
        {
          where: {
            AND: [
              accessibleBy(ability).ActiveCoordinator,
              {
                Coordinator: {
                  Faculty: {
                    userId: {
                      equals: user.id,
                    },
                  },
                },
              },
            ],
          },
        }
      );

      return res.json(activeCoordinator);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
