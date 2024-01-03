import prisma from "@/prisma/client";
import departmentReviewAbility from "@/services/ability/departmentReviewAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMFileId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { iMFileId } = validator.cast(req.body);

      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: iMFileId as string,
              },
            },
          ],
        },
      });

      if (!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });

        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            id: iMFile.iMId,
          },
        });

        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty can perform this action",
            },
          });
        }
        if (iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a department review for this IM file",
            },
          });
        }
      }

      const existingDepartmentReview = await prisma.departmentReview.findFirst({
        where: {
          IMFile: {
            IM: {
              id: {
                equals: iMFile.iMId,
              },
            },
          },
        },
      });

      if (existingDepartmentReview) {
        return res.status(400).json({
          error: { message: "IM has already been submitted for review" },
        });
      }

      const departmentReview = await prisma.departmentReview.create({
        data: {
          IMFile: {
            connect: {
              id: iMFileId,
            },
          },
          Event: {
            create: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              type: "DEPARTMENT_REVIEW_CREATED",
            },
          },
        },
      });

      return res.json(departmentReview);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const ability = departmentReviewAbility({ user });
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
      const departmentReviews = await prisma.departmentReview.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).DepartmentReview],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.departmentReview.count({
        where: {
          AND: [accessibleBy(ability).DepartmentReview],
        },
      });

      return res.json({ departmentReviews, count });
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
