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
      const id = req.query.id as string;

      const syllabus = await prisma.syllabus.findFirstOrThrow({
        where: {
          id: {
            equals: id,
          },
        },
      });
      return res.status(200).json(syllabus);
    } catch (error: any) {
      logger.error(error);
      return res.status(400).json({
        error: {
          message: error?.message ?? "Server Error",
        },
      });
    }
  };

  const putHandler = async () => {
    try {
      const id = req.query.id as string;

      const validator = Yup.object({
        courseTitle: Yup.string().required(),
        courseCode: Yup.string().required(),
      });
      await validator.validate(req.body);

      // TODO: how do we validate the course code?
      const { courseTitle, courseCode } = validator.cast(req.body);

      const syllabus = await prisma.syllabus.update({
        where: {
          id: id,
        },
        data: {
          courseTitle: courseTitle,
          courseCode: courseCode,
        },
      });
      return res.status(200).json(syllabus);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const id = req.query.id as string;

      const syllabus = await prisma.syllabus.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json({
        syllabus,
      });
    } catch (error: any) {
      logger.error(error);
      return res.status(400).json({
        error: {
          message: error?.message ?? "Server Error",
        },
      });
    }
  };

  switch (req.method) {
    case "GET":
      return getHandler();
    case "PUT":
      return putHandler();
    case "DELETE":
      return deleteHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
