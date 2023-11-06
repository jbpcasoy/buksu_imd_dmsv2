import prisma from "@/prisma/client";
import plagiarismFileAbility from "@/services/ability/plagiarismFileAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";
import fs from "fs";

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
  const ability = plagiarismFileAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const plagiarismFile = await prisma.plagiarismFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).PlagiarismFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      return res.json(plagiarismFile);
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

      let plagiarismFileToDelete;
      plagiarismFileToDelete = await prisma.plagiarismFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).PlagiarismFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
        include: {
          IM: {
            include: {
              Faculty: {
                include: {
                  ActiveFaculty: {
                    include: {
                      Faculty: {
                        include: {
                          User: true,
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

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        subject("PlagiarismFile", plagiarismFileToDelete)
      );

      const filePath = path.join(
        process.cwd(),
        `/files/plagiarism/${plagiarismFileToDelete.filename}`
      );
      fs.rm(filePath, (error) => {
        logger.error({ error });
        throw error;
      });

      const plagiarismFile = await prisma.plagiarismFile.delete({
        where: {
          id: id as string,
        },
      });

      return res.json(plagiarismFile);
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
