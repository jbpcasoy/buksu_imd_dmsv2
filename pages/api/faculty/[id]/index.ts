import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
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
    try {
      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          id: {
            equals: id,
          },
        },
      });

      return res.json(faculty);
    } catch (error) {
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
      return res.status(400).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const faculty = await prisma.faculty.delete({
        where: {
          id,
        },
      });

      return res.json(faculty);
    } catch (error) {
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
