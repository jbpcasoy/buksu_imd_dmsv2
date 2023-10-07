import prisma from "@/prisma/client";
import iMFileAbility from "@/services/ability/iMFileAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError, subject } from "@casl/ability";
import { User } from "@prisma/client";
import { Fields, Formidable } from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as Yup from "yup";

//set bodyparser
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
    // Read body using formidable
    const data: any = await new Promise((resolve, reject) => {
      const form = new Formidable();

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err });
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

    try {
      await validator.validate(body);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const { iMId } = validator.cast(body);

    // Check if user can create im file
    let ability;
    let iM;
    let faculty;
    try {
      iM = await prisma.iM.findFirstOrThrow({
        where: {
          id: {
            equals: iMId,
          },
        },
      });

      faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          ActiveFaculty: {
            Faculty: {
              userId: {
                equals: user.id,
              },
            },
          },
        },
      });
      // console.log({user, faculty, iM})

      ability = iMFileAbility(user, faculty, iM);
    } catch (error) {
      return res.status(404).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "createIMFile",
        subject("Faculty", faculty)
      );
    } catch (error) {
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
            id: iMId,
          },
        },
        filename,
      },
    });

    res.status(200).json(iMFile);
  };

  switch (req.method) {
    case "POST":
      return await postHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
};
