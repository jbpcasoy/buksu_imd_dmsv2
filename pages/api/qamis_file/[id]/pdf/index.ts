import prisma from "@/prisma/client";
import qAMISFileAbility from "@/services/ability/qAMISFileAbility";
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
  const ability = qAMISFileAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const qAMISFile = await prisma.qAMISFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).QAMISFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });


      res.setHeader("Content-Disposition", `inline`);
      res.setHeader("Content-Type", `application/pdf`);

      const destination = path.join(process.cwd(), `/files/qamis/${qAMISFile.filename}`);
      const readFile = promisify(fs.readFile);
      const file = await readFile(destination);

      return res.send(file);
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
