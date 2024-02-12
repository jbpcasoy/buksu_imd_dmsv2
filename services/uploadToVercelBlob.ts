import { put } from "@vercel/blob";
import { File } from "formidable";
import fs from "fs";

export default async function uploadToVercelBlob(file: File, path: string) {
  const fileBlob = fs.readFileSync(file.filepath);
  const vercelBlobPath = `${process.env.NODE_ENV}/${path}`;
  const blob = await put(vercelBlobPath, fileBlob, {
    access: "public",
  });
  return blob;
}
