// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/prisma/client";
import userAbility from "@/services/ability/userAbility";
import getServerUser from "@/services/getServerUser";
import { accessibleBy } from "@casl/prisma";
import { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

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
  const ability = userAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        skip: Yup.number().required(),
        take: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const users = await prisma.user.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).User],
        },
      });
      const count = await prisma.user.count({
        where: {
          AND: [accessibleBy(ability).User],
        },
      });

      return res.json({ users, count });
    } catch (error: any) {
      console.error(error);
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
