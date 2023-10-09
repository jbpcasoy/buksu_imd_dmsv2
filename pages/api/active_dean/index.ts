import prisma from "@/prisma/client";
import activeDeanAbility from "@/services/ability/activeDeanAbility";
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

  let ability = activeDeanAbility({ user });

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
        "ActiveDean"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { activeFacultyId } = validator.cast(req.body);
    try {
      const dean = await prisma.dean.findFirstOrThrow({
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

      const userActiveDeanCount = await prisma.activeDean.count({
        where: {
          Dean: {
            Faculty: {
              id: {
                equals: dean.facultyId,
              },
            },
          },
        },
      });

      if (userActiveDeanCount > 0) {
        return res.status(409).json({
          error: { message: "User can only have one active dean" },
        });
      }

      const activeDean = await prisma.activeDean.create({
        data: {
          Dean: {
            connect: {
              id: dean.id,
            },
          },
        },
      });

      return res.json(activeDean);
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
      const activeDeans = await prisma.activeDean.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveDean,
            {
              Dean: {
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
      const count = await prisma.activeDean.count({
        where: {
          AND: [accessibleBy(ability).ActiveDean],
        },
      });

      return res.json({ activeDeans, count });
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
