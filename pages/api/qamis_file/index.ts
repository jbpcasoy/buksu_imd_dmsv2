import prisma from "@/prisma/client";
import qAMISFileAbility from "@/services/ability/qAMISFileAbility";
import submittedQAMISSuggestionAbility from "@/services/ability/submittedQAMISSuggestionAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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
      const body = {
        submittedQAMISSuggestionId: fields?.submittedQAMISSuggestionId?.at(0),
      };
      // Validate request body
      const validator = Yup.object({
        submittedQAMISSuggestionId: Yup.string().required(),
      });
      await validator.validate(body);
      const { submittedQAMISSuggestionId } = validator.cast(body);

      const submittedQAMISSuggestion = await prisma.submittedQAMISSuggestion.findFirstOrThrow({
        where: {
          id: {
            equals: submittedQAMISSuggestionId,
          },
        },
      });

      const ability = submittedQAMISSuggestionAbility({ user });
      ForbiddenError.from(ability).throwUnlessCan(
        "connectToQAMISFile",
        subject("SubmittedQAMISSuggestion", submittedQAMISSuggestion)
      );

      // Save file to server
      const file = data.files.file[0];
      const filename = `${file.newFilename}.pdf`;
      const filePath = file.filepath;
      const destination = path.join(process.cwd(), `/files/qamis/${filename}`);
      fs.copyFile(filePath, destination, (err) => {
        if (err) throw err;
      });

      // create object to server
      const qAMISFile = await prisma.qAMISFile.create({
        data: {
          SubmittedQAMISSuggestion: {
            connect: {
              id: submittedQAMISSuggestionId,
            },
          },
          filename,
          mimetype: file.mimetype,
          size: file.size,
          originalFilename: file.originalFilename,
        },
      });
      res.status(200).json(qAMISFile);
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

      const ability = qAMISFileAbility({ user });

      const qAMISFiles = await prisma.qAMISFile.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).QAMISFile],
        },
      });
      const count = await prisma.qAMISFile.count({
        where: {
          AND: [accessibleBy(ability).QAMISFile],
        },
      });

      return res.json({ qAMISFiles, count });
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
