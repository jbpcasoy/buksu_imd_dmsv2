import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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

  const postHandler = async () => {
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
        q8_1: Yup.string()
          .oneOf(["VM", "M", "JE", "NM", "NAA"])
          .optional()
          .transform((originalValue, originalObject) => {
            return originalValue === "" ? undefined : originalValue;
          }),
        q8_2: Yup.string()
          .oneOf(["VM", "M", "JE", "NM", "NAA"])
          .optional()
          .transform((originalValue, originalObject) => {
            return originalValue === "" ? undefined : originalValue;
          }),
        q8_3: Yup.string()
          .oneOf(["VM", "M", "JE", "NM", "NAA"])
          .optional()
          .transform((originalValue, originalObject) => {
            return originalValue === "" ? undefined : originalValue;
          }),
        departmentReviewId: Yup.string().required(),
        activeFacultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

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
        departmentReviewId,
        activeFacultyId,
      } = validator.cast(req.body);

      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          ActiveFaculty: {
            id: {
              equals: activeFacultyId,
            },
          },
        },
      });

      if (!user.isAdmin) {
        if (faculty.userId !== user.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a peer review for this user",
            },
          });
        }

        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            IMFile: {
              some: {
                DepartmentReview: {
                  id: {
                    equals: departmentReviewId,
                  },
                },
              },
            },
          },
        });

        const iMDepartment = await prisma.department.findFirstOrThrow({
          where: {
            Faculty: {
              some: {
                IM: {
                  some: {
                    id: iM.id,
                  },
                },
              },
            },
          },
        });
        const ownDepartment = await prisma.department.findFirstOrThrow({
          where: {
            Faculty: {
              some: {
                id: {
                  equals: faculty.id,
                },
              },
            },
          },
        });

        if (ownDepartment.id !== iMDepartment.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a peer review for IMs outside your department",
            },
          });
        }
        if (faculty.id === iM.facultyId) {
          // throw new Error("Cannot peer review own IM");
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a peer review for your own IM",
            },
          });
        }
      }

      const peerReview = await prisma.peerReview.create({
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
          DepartmentReview: {
            connect: {
              id: departmentReviewId,
            },
          },
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
        },
      });

      return res.json(peerReview);
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
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);
      const peerReviews = await prisma.peerReview.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.peerReview.count({
        where: {},
      });

      return res.json({ peerReviews, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
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
