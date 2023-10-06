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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const postHandler = async () => {
    const validator = Yup.object({
      facultyId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const { facultyId } = validator.cast(req.body);
    try {
      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          id: {
            equals: facultyId,
          },
        },
      });

      const userActiveFacultyCount = await prisma.activeFaculty.count({
        where: {
          Faculty: {
            User: {
              id: {
                equals: faculty.userId,
              },
            },
          },
        },
      });

      if (userActiveFacultyCount > 0) {
        return res.status(409).json({
          error: { message: "User can only have one active faculty" },
        });
      }

      const activeFaculty = await prisma.activeFaculty.create({
        data: {
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
        },
      });

      return res.json(activeFaculty);
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
      const activeFaculties = await prisma.activeFaculty.findMany({
        skip,
        take,
      });
      const count = await prisma.activeFaculty.count();

      return res.json({ activeFaculties, count });
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
