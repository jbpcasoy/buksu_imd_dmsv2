// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getHandler = async () => {
    const validator = Yup.object({
      id: Yup.string().required(),
    });
    try {
      await validator.validate(req.query);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const prisma = new PrismaClient();
    const { id } = validator.cast(req.query);
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: {
            equals: id,
          },
        },
      });

      await prisma.$disconnect();
      return res.json(user);
    } catch (error) {
      await prisma.$disconnect();
      return res.status(400).json({ error });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
  }
  res.status(200).json({ name: "John Doe" });
}
