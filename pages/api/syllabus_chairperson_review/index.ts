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
  } catch (error: any) {
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        q1_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q1_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q1_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q2_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q2_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q2_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q2_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q2_5: Yup.string().oneOf(["YES", "NO"]).required(),
        q2_6: Yup.string().oneOf(["YES", "NO"]).required(),
        q3_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q3_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q3_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q3_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q3_5: Yup.string().oneOf(["YES", "NO"]).required(),
        q4_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q4_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q4_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q4_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q5_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q5_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q5_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q5_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q5_5: Yup.string().oneOf(["YES", "NO"]).required(),
        q6_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q6_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q6_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q6_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q6_5: Yup.string().oneOf(["YES", "NO"]).required(),
        q6_6: Yup.string().oneOf(["YES", "NO"]).required(),
        q7_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q7_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q7_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q7_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q8_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q8_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q8_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q8_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q9_1: Yup.string().oneOf(["YES", "NO"]).required(),
        q9_2: Yup.string().oneOf(["YES", "NO"]).required(),
        q9_3: Yup.string().oneOf(["YES", "NO"]).required(),
        q9_4: Yup.string().oneOf(["YES", "NO"]).required(),
        q9_5: Yup.string().oneOf(["YES", "NO"]).required(),
        q9_6: Yup.string().oneOf(["YES", "NO"]).required(),

        syllabusDepartmentReviewId: Yup.string().required(),
        activeChairpersonId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const {
        activeChairpersonId,
        q1_1,
        q1_2,
        q1_3,
        q2_1,
        q2_2,
        q2_3,
        q2_4,
        q2_5,
        q2_6,
        q3_1,
        q3_2,
        q3_3,
        q3_4,
        q3_5,
        q4_1,
        q4_2,
        q4_3,
        q4_4,
        q5_1,
        q5_2,
        q5_3,
        q5_4,
        q5_5,
        q6_1,
        q6_2,
        q6_3,
        q6_4,
        q6_5,
        q6_6,
        q7_1,
        q7_2,
        q7_3,
        q7_4,
        q8_1,
        q8_2,
        q8_3,
        q8_4,
        q9_1,
        q9_2,
        q9_3,
        q9_4,
        q9_5,
        q9_6,
        syllabusDepartmentReviewId,
      } = validator.cast(req.body);

      const chairperson = await prisma.chairperson.findFirstOrThrow({
        where: {
          ActiveChairperson: {
            id: {
              equals: activeChairpersonId,
            },
          },
        },
      });

      const syllabusChairpersonReview =
        await prisma.syllabusChairpersonReview.create({
          data: {
            Chairperson: {
              connect: {
                id: chairperson.id,
              },
            },
            SyllabusDepartmentReview: {
              connect: {
                id: syllabusDepartmentReviewId,
              },
            },
            q1_1,
            q1_2,
            q1_3,
            q2_1,
            q2_2,
            q2_3,
            q2_4,
            q2_5,
            q2_6,
            q3_1,
            q3_2,
            q3_3,
            q3_4,
            q3_5,
            q4_1,
            q4_2,
            q4_3,
            q4_4,
            q5_1,
            q5_2,
            q5_3,
            q5_4,
            q5_5,
            q6_1,
            q6_2,
            q6_3,
            q6_4,
            q6_5,
            q6_6,
            q7_1,
            q7_2,
            q7_3,
            q7_4,
            q8_1,
            q8_2,
            q8_3,
            q8_4,
            q9_1,
            q9_2,
            q9_3,
            q9_4,
            q9_5,
            q9_6,
          },
        });

      return res.status(201).json(syllabusChairpersonReview);
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
      const { take, skip } = validator.cast(req.query);

      const syllabusChairpersonReviews =
        await prisma.syllabusChairpersonReview.findMany({
          take,
          skip,
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.syllabusChairpersonReview.count();

      return res.status(201).json({ syllabusChairpersonReviews, count });
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
