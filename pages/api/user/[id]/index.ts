// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/prisma/client";
import userAbility from "@/services/ability/userAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { accessibleBy } from "@casl/prisma";
import { ForbiddenError, subject } from "@casl/ability";
import { Prisma, User } from "@prisma/client";
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
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = userAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });
      await validator.validate(req.query);

      const { id } = validator.cast(req.query);

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
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        name: Yup.string().optional(),
        image: Yup.string().optional(),
      });
      await validator.validate(req.body);

      const { id } = req.query;
      const { name, image } = validator.cast(req.body);

      const userToUpdate = await prisma.user.findFirstOrThrow({
        where: {
          id: {
            equals: id as string,
          },
        },
      });

      if (!user.isAdmin) {
        if (id !== user.id) {
          return res
            .status(403)
            .json({
              error: { message: "You are not allowed to update that user" },
            });
        }
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: id as string,
        },
        data: {
          name,
          image,
        },
      });

      return res.json(updatedUser);
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
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
