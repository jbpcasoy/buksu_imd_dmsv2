import prisma from "@/prisma/client";
import contentSpecialistReviewAbility from "@/services/ability/contentSpecialistReviewAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
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
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = contentSpecialistReviewAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const contentSpecialistReview =
        await prisma.contentSpecialistReview.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ContentSpecialistReview,
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(contentSpecialistReview);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "ContentSpecialistReview"
      );

      const { id } = validator.cast(req.query);

      const contentSpecialistReview =
        await prisma.contentSpecialistReview.delete({
          where: {
            id,
          },
        });

      return res.json(contentSpecialistReview);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        q1_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q1_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q2_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q2_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q2_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q2_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q3_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q4_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q4_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q4_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q5_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q5_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q5_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q5_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q6_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q6_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q6_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q6_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q6_5: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q7_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q7_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q7_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q7_4: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q7_5: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).required(),
        q8_1: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).optional(),
        q8_2: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).optional(),
        q8_3: Yup.string().oneOf(["VM", "M", "JE", "NM", "NAA"]).optional(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "ContentSpecialistReview"
      );

      const { id } = req.query;
      const {
        q1_1,
        q1_2,
        q2_1,
        q2_2,
        q2_3,
        q2_4,
        q3_1,
        q4_1,
        q4_2,
        q4_3,
        q5_1,
        q5_2,
        q5_3,
        q5_4,
        q6_1,
        q6_2,
        q6_3,
        q6_4,
        q6_5,
        q7_1,
        q7_2,
        q7_3,
        q7_4,
        q7_5,
        q8_1,
        q8_2,
        q8_3,
      } = validator.cast(req.body);

      const contentSpecialistReview =
        await prisma.contentSpecialistReview.update({
          where: {
            id: id as string,
          },
          data: {
            q1_1,
            q1_2,
            q2_1,
            q2_2,
            q2_3,
            q2_4,
            q3_1,
            q4_1,
            q4_2,
            q4_3,
            q5_1,
            q5_2,
            q5_3,
            q5_4,
            q6_1,
            q6_2,
            q6_3,
            q6_4,
            q6_5,
            q7_1,
            q7_2,
            q7_3,
            q7_4,
            q7_5,
            q8_1,
            q8_2,
            q8_3,
          },
        });

      return res.json(contentSpecialistReview);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
