import prisma from "@/prisma/client";
import iMFileAbility from "@/services/ability/iMFileAbility";
import getServerUser from "@/services/getServerUser";
import { accessibleBy } from "@casl/prisma";
import { ActiveFaculty, IM, User } from "@prisma/client";
import { Fields, Formidable } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";
import { ForbiddenError, subject } from "@casl/ability";
import iMAbility from "@/services/ability/iMAbility";

// TODO add ability validation
// connectToIM on iMAbility

//set bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let user: User;
  try {
    user = await getServerUser(req, res);
  } catch (error) {
    console.error(error);
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
      try {
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
      } catch (error) {
        return res.status(403).json({ error });
      }

      const ability = iMAbility({ user });
      try {
        ForbiddenError.from(ability).throwUnlessCan(
          "connectToIMFile",
          subject("IM", iM)
        );
      } catch (error) {
        console.error(error);
        return res.status(403).json({ error });
      }

      // Save file to server
      // TODO try if this implementation still works with linux, our deployment server will most likely be linux
      const file = data.files.file[0];
      const filename = `${file.newFilename}.pdf`;
      const filePath = file.filepath;
      const destination = path.join(process.cwd(), `/files/im/${filename}`);
      fs.copyFile(filePath, destination, (err) => {
        if (err) throw err;
      });

      // create object to server
      const iMFile = await prisma.iMFile.create({
        data: {
          IM: {
            connect: {
              id: iM.id,
            },
          },
          filename,
        },
      });
      res.status(200).json(iMFile);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({
        error: {
          message: error.message,
        },
      });
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

      const ability = iMFileAbility({ user });

      const iMFiles = await prisma.iMFile.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).IMFile],
        },
      });
      const count = await prisma.iMFile.count({
        where: {
          AND: [accessibleBy(ability).IMFile],
        },
      });

      return res.json({ iMFiles, count });
    } catch (error) {
      return res.status(400).json({ error });
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
};
