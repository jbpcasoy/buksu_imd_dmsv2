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

  const postHandler = async () => {
    try {
      // Read body using formidable
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

      // Save file to server
      const file = data.files.file[0];
      const extension = file.originalFilename.split(".").at(-1);
      const filename = `${file.newFilename}.${extension}`;
      const filePath = file.filepath;
      const destination = path.join(
        process.cwd(),
        `/files/profile_picture/${filename}`
      );
      fs.copyFile(filePath, destination, (err) => {
        if (err) throw err;
      });

      // create object to server
      const profilePictureFile = await prisma.profilePictureFile.create({
        data: {
          User: {
            connect: {
              id: user.id,
            },
          },
          filename,
          mimetype: file.mimetype,
          size: file.size,
          originalFilename: file.originalFilename,
        },
      });
      res.status(200).json(profilePictureFile);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });
      await validator.validate(req.query);
      const { skip, take } = validator.cast(req.query);

      const profilePictureFiles = await prisma.profilePictureFile.findMany({
        skip,
        take,
        where: {},
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.profilePictureFile.count({
        where: {},
      });

      return res.json({ profilePictureFiles, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "POST":
      return await postHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
