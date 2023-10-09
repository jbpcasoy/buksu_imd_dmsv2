import prisma from "@/prisma/client";
import activeDeanAbility from "@/services/ability/activeDeanAbility";
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

  let ability = activeDeanAbility({ user });

  const getHandler = async () => {
    try {
      const activeDean = await prisma.activeDean.findFirstOrThrow(
        {
          where: {
            AND: [
              accessibleBy(ability).ActiveDean,
              {
                Dean: {
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

      return res.json(activeDean);
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
