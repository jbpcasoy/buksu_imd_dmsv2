import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

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
      const iMFile = await prisma.iMFile.findFirstOrThrow({
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

      return res.json(iMFile);
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

      const iMFileToDelete = await prisma.iMFile.findFirstOrThrow({
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

      if(!user.isAdmin) {
        const faculty = await prisma.faculty.findFirst({
          where: {
            ActiveFaculty: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id
                  }
                }
              }
            }
          }
        })

        const iM = await prisma.iM.findFirstOrThrow({
          where: {
            id: iMFileToDelete.iMId
          }
        })

        if(!faculty) {
          return res.status(403).json({
            error: {
              message: "Only an active faculty can perform this action"
            }
          })
        }
        if(iM.facultyId !== faculty.id) {
          return res.status(403).json({
            error: {
              message: "You are not allowed to delete this IM file"
            }
          })
        }
      }

      const filePath = path.join(
        process.cwd(),
        `/files/im/${iMFileToDelete.filename}`
      );
      fs.rm(filePath, (error) => {
        logger.error({ error });
        throw error;
      });

      const iMFile = await prisma.iMFile.delete({
        where: {
          id: id as string,
        },
      });

      return res.json(iMFile);
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
