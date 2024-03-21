import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { del } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse } from "next";

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
      const profilePictureFile =
        await prisma.profilePictureFile.findFirstOrThrow({
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

      return res.json(profilePictureFile);
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

      let profilePictureFileToDelete;
      profilePictureFileToDelete =
        await prisma.profilePictureFile.findFirstOrThrow({
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

      if (!user.isAdmin) {
        return res.status(403).json({
          error: {
            message: "You are not allowed to perform this action",
          },
        });
      }

      // const filePath = path.join(
      //   process.cwd(),
      //   `/files/profile_picture/${profilePictureFileToDelete.filename}`
      // );
      // fs.rm(filePath, (error) => {
      //   logger.error({ error });
      //   throw error;
      // });

      const profilePictureFile = await prisma.profilePictureFile.delete({
        where: {
          id: id as string,
        },
      });

      await del(
        `${process.env.BLOB_URL}/${process.env.NODE_ENV}/files/profile_picture/${profilePictureFileToDelete.filename}`
      );

      return res.json(profilePictureFile);
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
