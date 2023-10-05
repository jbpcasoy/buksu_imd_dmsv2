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
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    const validator = Yup.object({
      id: Yup.string().required(),
    });
    try {
      await validator.validate(req.query);
    } catch (error) {
      return res.status(400).json({ error });
    }

    const { id } = validator.cast(req.query);
    const ability = await userAbility(user)
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).User,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
  }
  res.status(200).json({ name: "John Doe" });
}
