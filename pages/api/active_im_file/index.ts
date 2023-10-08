import prisma from "@/prisma/client";
import activeIMFileAbility from "@/services/ability/activeIMFileAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError } from "@casl/ability";
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

  let ability = activeIMFileAbility({ user });

  const postHandler = async () => {
    const validator = Yup.object({
      iMFileId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan("create", "ActiveIMFile");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { iMFileId } = validator.cast(req.body);
    try {
      const iMFile = await prisma.iMFile.findFirstOrThrow({
        where: {
          id: {
            equals: iMFileId,
          },
        },
      });

      const userActiveIMFileCount = await prisma.activeIMFile.count({
        where: {
          IMFile: {
            IM: {
              id: {
                equals: iMFile.id,
              },
            },
          },
        },
      });

      if (userActiveIMFileCount > 0) {
        return res.status(409).json({
          error: { message: "User can only have one active iMFile" },
        });
      }

      const activeIMFile = await prisma.activeIMFile.create({
        data: {
          IMFile: {
            connect: {
              id: iMFile.id,
            },
          },
        },
      });

      return res.json(activeIMFile);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const getHandler = async () => {
    const validator = Yup.object({
      take: Yup.number().required(),
      skip: Yup.number().required(),
      "filter[name]": Yup.string().optional(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const {
      skip,
      take,
      "filter[name]": filterName,
    } = validator.cast(req.query);
    try {
      const activeIMFiles = await prisma.activeIMFile.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveIMFile,
          ],
        },
      });
      const count = await prisma.activeIMFile.count({
        where: {
          AND: [accessibleBy(ability).ActiveIMFile],
        },
      });

      return res.json({ activeIMFiles, count });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  switch (req.method) {
    case "POST":
      return await postHandler();
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
