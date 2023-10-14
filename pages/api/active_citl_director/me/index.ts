import prisma from "@/prisma/client";
import activeCITLDirectorAbility from "@/services/ability/activeCITLDirectorAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  let ability = activeCITLDirectorAbility({user});

  const getHandler = async () => {
    try {
      const activeCITLDirector = await prisma.activeCITLDirector.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ActiveCITLDirector,
            {
              CITLDirector: {
                userId: {
                  equals: user.id,
                },
              },
            },
          ],
        },
      });

      return res.json(activeCITLDirector);
    } catch (error: any) {
      console.error(error);
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
