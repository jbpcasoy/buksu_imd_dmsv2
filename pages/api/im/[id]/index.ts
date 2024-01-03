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

  const getHandler = async () => {
    try {
      const { id } = req.query;

      const iM = await prisma.iM.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      return res.json(iM);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const { id } = req.query;

      const iMToDelete = await prisma.iM.findFirstOrThrow({
        where: {
          id: {
            equals: id as string,
          },
        },
      });

      const departmentReview = await prisma.departmentReview.findFirst({
        where: {
          IMFile: {
            IM: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      });

      if (departmentReview && !user.isAdmin) {
        return res.status(400).json({
          error: { message: "Cannot delete IMs submitted for review." },
        });
      }

      if (!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id as string,
                  },
                },
              },
            },
          },
        });
        if (!faculty) {
          return res.status(403).json({
            error: {
              message: "You must be an active faculty to perform this action",
            },
          });
        }
        if (faculty?.id !== iMToDelete.facultyId) {
          return res
            .status(403)
            .json({ error: { message: "You cannot delete this IM" } });
        }
      }

      const iM = await prisma.iM.delete({
        where: {
          id: id as string,
        },
      });
      return res.json(iM);
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
        title: Yup.string().required(),
        type: Yup.string()
          .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
          .required(),
      });
      await validator.validate(req.body);

      const { title, type } = validator.cast(req.body);

      const { id } = req.query;

      if (!user.isAdmin) {
        const iMOwner = await prisma.faculty.findFirst({
          where: {
            IM: {
              some: {
                Faculty: {
                  ActiveFaculty: {
                    Faculty: {
                      IM: {
                        some: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
        if (iMOwner?.userId !== user.id) {
          return res.status(403).json({
            error: { message: "You are not allowed to update this IM" },
          });
        }

        const departmentReview = await prisma.departmentReview.findFirst({
          where: {
            IMFile: {
              IM: {
                id: {
                  equals: id as string,
                },
              },
            },
          },
        });
        if (departmentReview) {
          return res.status(400).json({
            error: { message: "Cannot update IMs submitted for review" },
          });
        }
      }

      const iM = await prisma.iM.update({
        where: {
          id: id as string,
        },
        data: {
          title,
          type,
        },
      });

      return res.json(iM);
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
