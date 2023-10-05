import prisma from "@/prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      const department = await prisma.department.findFirstOrThrow({
        where: {
          id: {
            equals: id,
          },
        },
      });

      return res.json(department);
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
      const department = await prisma.department.delete({
        where: {
          id,
        },
      });

      return res.json(department);
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
