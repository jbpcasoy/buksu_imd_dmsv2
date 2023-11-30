import prisma from "@/prisma/client";
import iMFileAbility from "@/services/ability/iMFileAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";
import fs from "fs";
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
  const ability = iMFileAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).IMFile,
            {
              IM: {
                id: {
                  equals: id as string,
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });


      
      res.setHeader("Content-Type", `application/pdf`);

      const destination = path.join(
        process.cwd(),
        `/files/im/${iMFile.filename}`
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
