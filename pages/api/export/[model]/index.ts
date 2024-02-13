import prisma from "@/prisma/client";
import archiveExport from "@/services/archiveExport";
import exportDataToCSV from "@/services/exportDataToCsv";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { del } from "@vercel/blob";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
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
    return res
      .status(403)
      .json({ error: { message: "Admin Access Required" } });
  }

  const getHandler = async () => {
    try {
      const model = req.query.model as string;
      const models = Object.keys(prisma).filter((key: string) => {
        return !(key.startsWith("_") || key.startsWith("$"));
      });

      if (!models.includes(model)) {
        return res.status(400).json({
          error: {
            message: "Model is not allowed",
          },
        });
      }

      const data = await (prisma as any)[model].findMany();
      const filename = `export_${model}_${new Date()}.csv`;
      const destination = `${process.env.NODE_ENV}/files/export/${filename}`;

      const csvBlob = await exportDataToCSV({ data, destination });

      try {
        const response = await fetch(csvBlob.url);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Set appropriate headers
        res.setHeader("Content-Type", "text/csv");
        // res.setHeader("Content-Disposition", "inline");

        response.body?.pipe(res);

        response.body?.on("end", async () => {
          return await del(csvBlob.url);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
      }

      // for (let model of models) {
      //   const data = await (prisma as any)[model].findMany();
      //   const filename = `export_${model}.csv`;
      //   const destination = `${process.env.NODE_ENV}/files/export/${filename}`;

      //   try {
      //     await exportDataToCSV({ data, destination });
      //   } catch (err: any) {
      //     continue;
      //   }
      // }
      // await archiveExport();

      // const destination = path.join(process.cwd(), `/export.zip`);

      // res.setHeader("Content-Type", "application/zip");
      // res.setHeader("Content-Disposition", `attachment; filename=export.zip`);

      // const readFile = promisify(fs.readFile);
      // const file = await readFile(destination);
      // return res.send(file);
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
