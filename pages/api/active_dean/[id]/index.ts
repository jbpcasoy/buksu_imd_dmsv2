import prisma from "@/prisma/client";
import activeDeanAbility from "@/services/ability/activeDeanAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
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

  let ability = activeDeanAbility({user});

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
      const activeDean = await prisma.activeDean.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ActiveDean,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(activeDean);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const deleteHandler = async () => {
    const validator = Yup.object({
      id: Yup.string().required(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan("delete", "ActiveDean");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const activeDean = await prisma.activeDean.delete({
        where: {
          id,
        },
      });

      return res.json(activeDean);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
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
