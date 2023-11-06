import prisma from "@/prisma/client";
import plagiarismFileAbility from "@/services/ability/plagiarismFileAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { accessibleBy } from "@casl/prisma";
import { ActiveFaculty, IM, User } from "@prisma/client";
import { Fields, Formidable } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";
import { ForbiddenError, subject } from "@casl/ability";
import iMAbility from "@/services/ability/iMAbility";

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
      const body = {
        iMId: fields?.iMId?.at(0),
      };
      // Validate request body
      const validator = Yup.object({
        iMId: Yup.string().required(),
      });
      await validator.validate(body);
      const { iMId } = validator.cast(body);

      // Find IM
      let iM: IM;
      iM = await prisma.iM.findFirstOrThrow({
        where: {
          id: {
            equals: iMId,
          },
        },
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
      });

      const ability = iMAbility({ user });
      ForbiddenError.from(ability).throwUnlessCan(
        "connectToPlagiarismFile",
        subject("IM", iM)
      );

      // Save file to server
      const file = data.files.file[0];
      const filename = `${file.newFilename}.pdf`;
      const filePath = file.filepath;
      const destination = path.join(process.cwd(), `/files/plagiarism/${filename}`);
      fs.copyFile(filePath, destination, (err) => {
        if (err) throw err;
      });

      // create object to server
      const plagiarismFile = await prisma.plagiarismFile.create({
        data: {
          IM: {
            connect: {
              id: iM.id,
            },
          },
          filename,
          mimetype: file.mimetype,
          size: file.size,
          originalFilename: file.originalFilename,
        },
      });
      res.status(200).json(plagiarismFile);
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

      const ability = plagiarismFileAbility({ user });

      const plagiarismFiles = await prisma.plagiarismFile.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).PlagiarismFile],
        },
      });
      const count = await prisma.plagiarismFile.count({
        where: {
          AND: [accessibleBy(ability).PlagiarismFile],
        },
      });

      return res.json({ plagiarismFiles, count });
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