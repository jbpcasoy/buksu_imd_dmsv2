import prisma from "@/prisma/client";
import archiveExport from "@/services/archiveExport";
import exportDataToCSV from "@/services/exportDataToCsv";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
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

  if (!user.isAdmin) {
    return res.status(403).json({ error: { message: "Admin Access Required" } });
  }

  const getHandler = async () => {
    try {
      const models = Object.keys(prisma).filter((key: string) => {
        return !(key.startsWith("_") || key.startsWith("$"));
      });

      for (let model of models) {
        const data = await (prisma as any)[model].findMany();
        const filename = `export_${model}.csv`;
        const destination = path.join(
          process.cwd(),
          `/files/export/${filename}`
        );

        try {
          await exportDataToCSV({ data, destination });
        } catch (err: any) {
          continue;
        }
      }
      await archiveExport();

      const destination = path.join(process.cwd(), `/export.zip`);

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename=export.zip`);

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
