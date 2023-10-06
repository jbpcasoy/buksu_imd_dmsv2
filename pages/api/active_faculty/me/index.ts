import prisma from "@/prisma/client";
import activeFacultyAbility from "@/services/ability/activeFacultyAbility";
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

  let ability = activeFacultyAbility(user);

  const getHandler = async () => {
    try {
      const activeFaculty = await prisma.activeFaculty.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ActiveFaculty,
            {
              Faculty: {
                userId: {
                  equals: user.id,
                },
              },
            },
          ],
        },
      });

      return res.json(activeFaculty);
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
