import prisma from "@/prisma/client";
import qAMISFileAbility from "@/services/ability/qAMISFileAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;

  try {
    user = await getServerUser(req, res);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = qAMISFileAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const qAMISFile = await prisma.qAMISFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).QAMISFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      return res.json(qAMISFile);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const { id } = req.query;

      let qAMISFileToDelete;
      qAMISFileToDelete = await prisma.qAMISFile.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).QAMISFile,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        subject("QAMISFile", qAMISFileToDelete)
      );

      const filePath = path.join(
        process.cwd(),
        `/files/im/${qAMISFileToDelete.filename}`
      );
      fs.rm(filePath, (error) => {
        console.error({ error });
        throw error;
      });

      const qAMISFile = await prisma.qAMISFile.delete({
        where: {
          id: id as string,
        },
      });

      return res.json(qAMISFile);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
