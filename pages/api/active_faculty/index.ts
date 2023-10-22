import prisma from "@/prisma/client";
import activeFacultyAbility from "@/services/ability/activeFacultyAbility";
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

  let ability = activeFacultyAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        facultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "ActiveFaculty");

      const { facultyId } = validator.cast(req.body);

      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          id: {
            equals: facultyId,
          },
        },
      });

      const userActiveFacultyCount = await prisma.activeFaculty.count({
        where: {
          Faculty: {
            User: {
              id: {
                equals: faculty.userId,
              },
            },
          },
        },
      });

      if (userActiveFacultyCount > 0) {
        return res.status(409).json({
          error: { message: "User can only have one active faculty" },
        });
      }

      const activeFaculty = await prisma.activeFaculty.create({
        data: {
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
        },
      });

      return res.json(activeFaculty);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);

      const activeFaculties = await prisma.activeFaculty.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveFaculty,
            {
              Faculty: {
                User: {
                  name: {
                    contains: filterName,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
      });
      const count = await prisma.activeFaculty.count({
        where: {
          AND: [accessibleBy(ability).ActiveFaculty],
        },
      });

      return res.json({ activeFaculties, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
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
