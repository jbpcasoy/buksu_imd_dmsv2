import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
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
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const postHandler = async () => {
    const validator = Yup.object({
      name: Yup.string().required(),
      collegeId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const { name, collegeId } = validator.cast(req.body);
    try {
      const college = await prisma.college.findFirstOrThrow({
        where: {
          id: {
            equals: collegeId,
          },
        },
      });
      const department = await prisma.department.create({
        data: {
          name,
          College: {
            connect: {
              id: college.id,
            },
          },
        },
      });

      return res.json(department);
    } catch (error) {
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

    const { skip, take } = validator.cast(req.query);
    try {
      const faculties = await prisma.department.findMany({
        skip,
        take,
      });
      const count = await prisma.department.count();

      return res.json({ faculties, count });
    } catch (error) {
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
