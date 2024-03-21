import { put } from "@vercel/blob";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ALLOWED_FOLDERS = ["im", "plagiarism", "profile_picture", "qamis"];
  const folder = req.query.folder as string;
  if (ALLOWED_FOLDERS.includes(folder)) {
    return res.status(400).json({
      error: {
        message: "You are not allowed to upload on this folder",
      },
    });
  }

  const blob = await put(req.query.filename as string, req, {
    access: "public",
  });

  return res.status(200).json(blob);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
