import prisma from "@/prisma/client";
import collegeAbility from "@/services/ability/collegeAbility";
import userAbility from "@/services/ability/userAbility";
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
  const ability = collegeAbility({user});

  const postHandler = async () => {
    const validator = Yup.object({
      name: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan("create", "College");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { name } = validator.cast(req.body);
    try {
      const college = await prisma.college.create({
        data: {
          name,
        },
      });

      return res.json(college);
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
      const colleges = await prisma.college.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).College],
        },
      });
      const count = await prisma.college.count({
        where: {
          AND: [accessibleBy(ability).College],
        },
      });

      return res.json({ colleges, count });
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
