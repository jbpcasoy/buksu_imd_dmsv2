import uploadToVercelBlob from "@/services/uploadToVercelBlob";
import { put } from "@vercel/blob";
import { File, Formidable } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data: any = await new Promise((resolve, reject) => {
    const form = new Formidable();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject({ err });
      }
      resolve({ err, fields, files });
    });
  });
  // Save file to server
  const file: File = data.files.file[0];
  const filename = `${file.newFilename}.pdf`;
  const blob = await uploadToVercelBlob(file, `files/im/${filename}`);
  return res.status(200).json(blob);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

