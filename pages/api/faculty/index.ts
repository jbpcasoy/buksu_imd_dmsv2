import prisma from "@/prisma/client";
import facultyAbility from "@/services/ability/facultyAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  let ability = facultyAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        userId: Yup.string().required(),
        departmentId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "Faculty");

      const { userId, departmentId } = validator.cast(req.body);

      const faculty = await prisma.faculty.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
          Department: {
            connect: {
              id: departmentId,
            },
          },
        },
      });

      return res.json(faculty);
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
      const faculties = await prisma.faculty.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).Faculty,
            {
              User: {
                name: {
                  contains: filterName,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      });
      const count = await prisma.faculty.count({
        where: {
          AND: [accessibleBy(ability).Faculty],
        },
      });

      return res.json({ faculties, count });
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
