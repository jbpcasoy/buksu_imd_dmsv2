import prisma from "@/prisma/client";
import profilePictureFileAbility from "@/services/ability/profilePictureFileAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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
  const ability = profilePictureFileAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const profilePictureFile = await prisma.profilePictureFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ProfilePictureFile,
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
      profilePictureFileToDelete = await prisma.profilePictureFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ProfilePictureFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        subject("ProfilePictureFile", profilePictureFileToDelete)
      );

      const filePath = path.join(
        process.cwd(),
        `/files/qamis/${profilePictureFileToDelete.filename}`
      );
      fs.rm(filePath, (error) => {
        logger.error({ error });
        throw error;
      });

      const profilePictureFile = await prisma.profilePictureFile.delete({
        where: {
          id: id as string,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
