import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postHandler = async () => {
    const validator = Yup.object({
      userId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const prisma = new PrismaClient();
    const { userId } = validator.cast(req.body);
    try {
      const faculty = await prisma.faculty.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await prisma.$disconnect();
      return res.json({ faculty });
    } catch (error) {
      await prisma.$disconnect();
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
      return res.status(400).json({ error });
    }

    const prisma = new PrismaClient();
    const { skip, take } = validator.cast(req.query);
    try {
      const faculties = await prisma.faculty.findMany({
        skip,
        take,
      });
      const count = await prisma.faculty.count();

      await prisma.$disconnect();
      return res.json({ faculties, count });
    } catch (error) {
      await prisma.$disconnect();
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
