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

  switch (req.method) {
    case "POST":
      return await postHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
