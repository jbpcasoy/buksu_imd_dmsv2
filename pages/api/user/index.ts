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
      skip: Yup.number().required(),
      take: Yup.number().required(),
    });
    try {
      await validator.validate(req.query);
    } catch (error) {
      return res.status(400).json({ error });
    }
    const { skip, take } = validator.cast(req.query);
    const prisma = new PrismaClient();
    try {
      const users = await prisma.user.findMany({
        skip,
        take,
      });
      const count = await prisma.user.count();

      await prisma.$disconnect();
      return res.json({ users, count });
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
