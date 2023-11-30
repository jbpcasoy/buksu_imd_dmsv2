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
import { promisify } from "util";

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
      const profilePictureFile =
        await prisma.profilePictureFile.findFirstOrThrow({
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

      res.setHeader("Content-Type", `image/*`);

      const destination = path.join(
        process.cwd(),
        `/files/profile_picture/${profilePictureFile.filename}`
      );
      const file = fs.createReadStream(destination);
      file.pipe(res);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
