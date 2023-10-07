// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/prisma/client";
import userAbility from "@/services/ability/userAbility";
import getServerUser from "@/services/getServerUser";
import { accessibleBy } from "@casl/prisma";
import { ForbiddenError, subject } from "@casl/ability";
import { User } from "@prisma/client";
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
    const validator = Yup.object({
      id: Yup.string().required(),
    });
    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const { id } = validator.cast(req.query);
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
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const putHandler = async () => {
    const queryValidator = Yup.object({
      id: Yup.string().required(),
    });
    try {
      await queryValidator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const bodyValidator = Yup.object({
      name: Yup.string().required(),
    });
    try {
      await bodyValidator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
    const { id } = queryValidator.cast(req.query);
    const { name } = bodyValidator.cast(req.body);

    let userToUpdate;
    try {
      userToUpdate = await prisma.user.findFirstOrThrow({
        where: {
          id: {
            equals: id,
          },
        },
      });
    } catch (error) {
      return res.status(404).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        subject("User", userToUpdate)
      );
    } catch (error) {
      return res.status(403).json({ error });
    }

    try {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
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
