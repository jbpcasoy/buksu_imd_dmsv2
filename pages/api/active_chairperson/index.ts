import prisma from "@/prisma/client";
import activeChairpersonAbility from "@/services/ability/activeChairpersonAbility";
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

  let ability = activeChairpersonAbility({ user });

  const postHandler = async () => {
    const validator = Yup.object({
      activeFacultyId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ActiveChairperson"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { activeFacultyId } = validator.cast(req.body);
    try {
      const chairperson = await prisma.chairperson.findFirstOrThrow({
        where: {
          Faculty: {
            ActiveFaculty: {
              id: {
                equals: activeFacultyId,
              },
            },
          },
        },
      });

      const userActiveChairpersonCount = await prisma.activeChairperson.count({
        where: {
          Chairperson: {
            Faculty: {
              id: {
                equals: chairperson.facultyId,
              },
            },
          },
        },
      });

      if (userActiveChairpersonCount > 0) {
        return res.status(409).json({
          error: { message: "User can only have one active chairperson" },
        });
      }

      const activeChairperson = await prisma.activeChairperson.create({
        data: {
          Chairperson: {
            connect: {
              id: chairperson.id,
            },
          },
        },
      });

      return res.json(activeChairperson);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const getHandler = async () => {
    const validator = Yup.object({
      take: Yup.number().required(),
      skip: Yup.number().required(),
      "filter[name]": Yup.string().optional(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const {
      skip,
      take,
      "filter[name]": filterName,
    } = validator.cast(req.query);
    try {
      const activeChairpersons = await prisma.activeChairperson.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveChairperson,
            {
              Chairperson: {
                Faculty: {
                  User: {
                    name: {
                      contains: filterName,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
      });
      const count = await prisma.activeChairperson.count({
        where: {
          AND: [accessibleBy(ability).ActiveChairperson],
        },
      });

      return res.json({ activeChairpersons, count });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
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
