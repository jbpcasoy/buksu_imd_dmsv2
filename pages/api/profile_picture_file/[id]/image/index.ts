import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

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
      const { id } = req.query;
      const profilePictureFile =
        await prisma.profilePictureFile.findFirstOrThrow({
          where: {
            AND: [
              {
                id: {
                  equals: id as string,
                },
              },
            ],
          },
        });

      // res.setHeader("Content-Type", `image/*`);

      // const destination = path.join(
      //   process.cwd(),
      //   `/files/profile_picture/${profilePictureFile.filename}`
      // );
      // const file = fs.createReadStream(destination);
      // file.pipe(res);
      try {
        const response = await fetch(
          `${process.env.BLOB_URL}/${process.env.NODE_ENV}/files/profile_picture/${profilePictureFile.filename}`
        );
        console.log({
          url: `${process.env.BLOB_URL}/${process.env.NODE_ENV}/files/profile_picture/${profilePictureFile.filename}`,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Set appropriate headers
        res.setHeader("Content-Type", `image/*`);
        res.setHeader("Content-Disposition", "inline");
        // res.send(response.blob);
        response.body?.pipe(res);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
      }
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
