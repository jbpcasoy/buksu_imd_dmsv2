import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { es } from "@faker-js/faker";
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
        iMId: Yup.string().required(),
        activeFacultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { iMId, activeFacultyId } = validator.cast(req.body);

      const activeFaculty = await prisma.activeFaculty.findFirstOrThrow({
        where: {
          id: activeFacultyId,
        },
      });
      const department = await prisma.department.findFirst({
        where: {
          AND: [
            {
              Faculty: {
                some: {
                  ActiveFaculty: {
                    id: {
                      equals: activeFacultyId,
                    },
                  },
                },
              },
            },
            {
              Faculty: {
                some: {
                  IM: {
                    some: {
                      id: {
                        equals: iMId,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      });
      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          IM: {
            some: {
              id: {
                equals: iMId,
              },
            },
          },
        },
      });
      if (!user.isAdmin) {
        if (faculty.userId !== user.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to add a co-author for this IM",
            },
          });
        }
        const departmentReview = await prisma.departmentReview.findFirst({
          where: {
            IMFile: {
              IM: {
                id: {
                  equals: iMId,
                },
              },
            },
          },
        });
        if (departmentReview) {
          return res.status(400).json({
            error: {
              message: "Error: IM is already submitted for review",
            },
          });
        }
      }

      if (!department) {
        return res.status(400).json({
          error: {
            message:
              "A faculty can only co-author an IM within their department",
          },
        });
      }

      if (faculty.id === activeFaculty.facultyId) {
        return res.status(400).json({
          error: {
            message: "An author cannot be a co-author of their own IM",
          },
        });
      }

      const coAuthor = await prisma.coAuthor.create({
        data: {
          IM: {
            connect: {
              id: iMId,
            },
          },
          Faculty: {
            connect: {
              id: activeFaculty.facultyId,
            },
          },
        },
      });
      return res.json(coAuthor);
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

      const coAuthors = await prisma.coAuthor.findMany({
        skip,
        take,
      });
      const count = await prisma.coAuthor.count();

      return res.json({ coAuthors, count });
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
