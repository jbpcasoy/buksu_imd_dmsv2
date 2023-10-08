import prisma from "@/prisma/client";
import iMFileAbility from "@/services/ability/iMFileAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = iMFileAbility({ user });

  const getHandler = async () => {
    const { id } = req.query;
    try {
      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).IMFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      return res.json(iMFile);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const deleteHandler = async () => {
    try {
      const { id } = req.query;

      let iMFileToDelete;
      try {
        iMFileToDelete = await prisma.iMFile.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).IMFile,
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
      } catch (error) {
        return res.status(404).json({ error });
      }

      try {
        ForbiddenError.from(ability).throwUnlessCan(
          "delete",
          subject("IMFile", iMFileToDelete)
        );
      } catch (error) {
        console.error(error);
        return res.status(403).json({ error });
      }

      const filePath = path.join(
        process.cwd(),
        `/files/im/${iMFileToDelete.filename}`
      );
      fs.rm(filePath, (error) => {
        console.error({ error });
        throw error;
      });

      const iMFile = await prisma.iMFile.delete({
        where: {
          id: id as string,
        },
      });

      return res.json(iMFile);
    } catch (error: any) {
      // TODO replace all return *.*.json({ error }); to *.*.json({ error: { message: error.message } });
      console.error(error);
      return res.status(400).json({
        error: {
          message: error.message,
        },
      });
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