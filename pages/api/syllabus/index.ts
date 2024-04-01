import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;
  try {
    user = await getServerUser(req, res);
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });
      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const syllabi = await prisma.syllabus.findMany({
        skip: skip,
        take: take,
      });
      const count = await prisma.syllabus.count();

      return res.json({
        syllabi,
        count,
      });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        courseTitle: Yup.string().required(),
        courseCode: Yup.string().required(),
        activeFacultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

      // TODO: how do we validate the course code?
      const { activeFacultyId, courseTitle, courseCode } = validator.cast(
        req.body
      );

      const activeFaculty = await prisma.activeFaculty.findFirstOrThrow({
        where: {
          id: activeFacultyId,
        },
      });

      const syllabus = await prisma.syllabus.create({
        data: {
          courseTitle: courseTitle,
          courseCode: courseCode,
          Faculty: {
            connect: {
              id: activeFaculty.facultyId,
            },
          },
        },
      });

      res.status(201).json(syllabus);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return getHandler();
    case "POST":
      return postHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
