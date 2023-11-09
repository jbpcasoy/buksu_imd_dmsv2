import prisma from "@/prisma/client";
import submittedReturnedCITLRevisionAbility from "@/services/ability/submittedReturnedCITLRevisionAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { accessibleBy } from "@casl/prisma";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let user: User;

  try {
    user = await getServerUser(req, res);
    981;
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = submittedReturnedCITLRevisionAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const submittedReturnedCITLRevision =
        await prisma.submittedReturnedCITLRevision.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).SubmittedReturnedCITLRevision,
              {
                ReturnedCITLRevision: {
                  id: id as string,
                },
              },
            ],
          },
        });

      return res.json(submittedReturnedCITLRevision);
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
