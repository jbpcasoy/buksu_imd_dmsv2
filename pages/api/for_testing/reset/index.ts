import prisma from "@/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(400).send("This route is only for testing!");
  }

  if (req.method === "GET") {
    await prisma.faculty.deleteMany();
    await prisma.department.deleteMany();
    await prisma.college.deleteMany();

    return res.status(200).send("Reset finished");
  } else {
    return res.status(405).send(`${req.method} not allowed`);
  }
}
