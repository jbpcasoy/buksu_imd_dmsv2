import getFilesWithMetadata from "@/services/getFilesWithMetadata";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
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
  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: {
            message: "You are not allowed to perform this action",
          },
        });
      }

      const folderPath = "files/im";
      const fileMetadatas = await getFilesWithMetadata(folderPath, take, skip);
      return res.status(200).json({
        fileMetadatas,
        count: fileMetadatas.length,
      });
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
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
