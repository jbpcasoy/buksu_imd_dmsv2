import prisma from "@/prisma/client";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postHandler = async () => {
    const validator = Yup.object({
      name: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error });
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
      return res.status(400).json({ error });
    }
  };

  //   const getHandler = async () => {
  //     const validator = Yup.object({
  //       take: Yup.number().required(),
  //       skip: Yup.number().required(),
  //     });

  //     try {
  //       await validator.validate(req.query);
  //     } catch (error) {
  //       return res.status(400).json({ error });
  //     }

  //     const { skip, take } = validator.cast(req.query);
  //     try {
  //       const faculties = await prisma.faculty.findMany({
  //         skip,
  //         take,
  //       });
  //       const count = await prisma.faculty.count();

  //       return res.json({ faculties, count });
  //     } catch (error) {
  //       return res.status(400).json({ error });
  //     }
  //   };

  switch (req.method) {
    case "POST":
      return await postHandler();
    // case "GET":
    //   return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
