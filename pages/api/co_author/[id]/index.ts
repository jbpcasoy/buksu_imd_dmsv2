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
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const coAuthor = await prisma.coAuthor.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id,
              },
            },
          ],
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

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);
      const { id } = validator.cast(req.query);

      if (!user.isAdmin) {
        const coAuthorToDelete = await prisma.coAuthor.findFirstOrThrow({
          where: {
            id: {
              equals: id as string,
            },
          },
        });

        const faculty = await prisma.faculty.findFirstOrThrow({
          where: {
            IM: {
              some: {
                id: {
                  equals: coAuthorToDelete.iMId,
                },
              },
            },
          },
        });

        if (faculty.userId !== user.id) {
          return res.status(403).json({
            error: { message: "You are not allowed to delete this co-author" },
          });
        }

        const departmentReview = await prisma.departmentReview.findFirst({
          where: {
            IMFile: {
              IM: {
                id: {
                  equals: coAuthorToDelete.iMId,
                },
              },
            },
          },
        });
        if(departmentReview) {
          return res.status(403).json({
            error: {
              message: "Error: IM is already submitted for review"
            }
          })
        }
      }

      const coAuthor = await prisma.coAuthor.delete({
        where: {
          id,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
