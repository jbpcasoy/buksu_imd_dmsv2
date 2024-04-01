import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { Fields, Formidable } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";

//set bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

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
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });
      await validator.validate(req.query);
      const { skip, take } = validator.cast(req.query);

      const syllabusFiles = await prisma.syllabusFile.findMany({
        take: take,
        skip: skip,
      });
      const count = await prisma.syllabusFile.count({
        where: {},
      });

      return res.status(200).json({
        syllabusFiles,
        count,
      });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const postHandler = async () => {
    try {
      const data: any = await new Promise((resolve, reject) => {
        const form = new Formidable();
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject({ err });
          }
          resolve({ err, fields, files });
        });
      });
      // Parse request body
      const fields: Fields = data.fields;

      const body = {
        syllabusId: fields?.syllabusId?.at(0),
      };

      const validator = Yup.object({
        syllabusId: Yup.string().required(),
      });
      await validator.validate(body);

      const { syllabusId } = validator.cast(body);

      const syllabus = await prisma.syllabus.findFirstOrThrow({
        where: {
          id: {
            equals: syllabusId,
          },
        },
      });

      // Save file to server
      const file = data.files.file[0];
      const filename = `${file.newFilename}.pdf`;
      const filePath = file.filepath;
      const destination = path.join(
        process.cwd(),
        `/files/syllabus/${filename}`
      );
      fs.copyFile(filePath, destination, (err) => {
        if (err) throw err;
      });

      const syllabusFile = await prisma.syllabusFile.create({
        data: {
          Syllabus: {
            connect: {
              id: syllabus.id,
            },
          },
          filename: filename as string,
          mimetype: file.mimetype,
          size: file.size,
          originalFilename: file.originalFilename,
        },
      });

      return res.status(201).json(syllabusFile);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return getHandler();
    case "POST":
      return postHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
