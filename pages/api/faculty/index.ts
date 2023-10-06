import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import facultyAbility from "@/services/ability/facultyAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  let ability = facultyAbility(user);

  const postHandler = async () => {
    const validator = Yup.object({
      userId: Yup.string().required(),
      departmentId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan("create", "Faculty");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { userId, departmentId } = validator.cast(req.body);
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

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
      const faculties = await prisma.faculty.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).Faculty],
        },
      });
      const count = await prisma.faculty.count({
        where: {
          AND: [accessibleBy(ability).Faculty],
        },
      });

      return res.json({ faculties, count });
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
