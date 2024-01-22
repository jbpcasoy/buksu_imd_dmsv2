import prisma from "@/prisma/client";
import getFileWithMetadata from "@/services/getFileWithMetadata";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
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
      const { filename } = req.query;
      const folderPath = "files/im";
      const file = await getFileWithMetadata(folderPath, filename as string);
      if (!file) {
        return res.status(404).json({
          error: {
            message: "File not found",
          },
        });
      }

      return res.status(200).json(file);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    const { filename } = req.query;
    const folderPath = "files/im";
    const file = await getFileWithMetadata(folderPath, filename as string);

    const iMFile = await prisma.iMFile.findFirst({
      where: {
        filename: {
          equals: filename as string,
        },
      },
    });

    if (!user.isAdmin) {
      return res.status(403).json({
        error: {
          message: "You are not allowed to perform this action",
        },
      });
    }

    if (iMFile) {
      return res.status(400).json({
        error: {
          message: "You are not allowed to delete a referenced file",
        },
      });
    }

    const filePath = path.join(process.cwd(), `/files/im/${filename}`);
    fs.rm(filePath, (error) => {
      logger.error({ error });
      throw error;
    });

    return res.status(200).json(file);
  };

  switch (req.method) {
    case "GET":
      return getHandler();
    case "DELETE":
      return deleteHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
