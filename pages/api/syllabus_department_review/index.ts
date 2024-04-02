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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        syllabusFileId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { syllabusFileId } = validator.cast(req.body);

      const syllabusDepartmentReview =
        await prisma.syllabusDepartmentReview.create({
          data: {
            SyllabusFile: {
              connect: {
                id: syllabusFileId,
              },
            },
          },
        });

      return res.status(201).json(syllabusDepartmentReview);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });
      await validator.validate(req.query);
      const { skip, take } = validator.cast(req.query);

      const syllabusDepartmentReviews =
        await prisma.syllabusDepartmentReview.findMany({
          skip,
          take,
          where: {},
          orderBy: { updatedAt: "desc" },
        });
      const count = await prisma.syllabusDepartmentReview.count();

      return res.status(200).json({ syllabusDepartmentReviews, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "POST":
      return postHandler();
    case "GET":
      return getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
