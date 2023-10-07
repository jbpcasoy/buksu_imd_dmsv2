import prisma from "@/prisma/client";
import { Faculty, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";
import getServerUser from "@/services/getServerUser";
import iMAbility from "@/services/ability/iMAbility";
import { accessibleBy } from "@casl/prisma";
import { AppAbility } from "@/services/ability/abilityBuilder";

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

  let abilityIM: AppAbility;
  let userFaculty: Faculty;

  try {
    userFaculty = await prisma.faculty.findFirstOrThrow({
      where: {
        ActiveFaculty: {
          Faculty: {
            userId: {
              equals: user.id,
            },
          },
        },
      },
    });
    abilityIM = iMAbility({user, userFaculty});
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error });
  }

  const getHandler = async () => {
    const validator = Yup.object({
      take: Yup.number().required(),
      skip: Yup.number().required(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const { skip, take } = validator.cast(req.query);
    try {
      const iMs = await prisma.iM.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(abilityIM).IM,
            {
              Faculty: {
                id: {
                  equals: userFaculty.id,
                },
                Department: {
                  id: {
                    equals: userFaculty.departmentId,
                  },
                },
              },
            },
          ],
        },
      });
      const count = await prisma.iM.count({
        where: {
          AND: [
            accessibleBy(abilityIM).IM,
            {
              Faculty: {
                id: {
                  equals: userFaculty.id,
                },
                Department: {
                  id: {
                    equals: userFaculty.departmentId,
                  },
                },
              },
            },
          ],
        },
      });

      return res.json({ iMs, count });
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
