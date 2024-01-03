import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const college = await prisma.college.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(college);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: { message: "You are not allowed to delete this college" },
        });
      }

      const { id } = validator.cast(req.query);

      const college = await prisma.college.delete({
        where: {
          id,
        },
      });

      return res.json(college);
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
        name: Yup.string().required(),
      });

      await validator.validate(req.body);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: { message: "You are not allowed to update this college" },
        });
      }

      const { id } = req.query;
      const { name } = validator.cast(req.body);

      const existingCollege = await prisma.college.findFirst({
        where: {
          AND: [
            {
              name: {
                equals: name,
              },
            },
            {
              id: {
                not: id as string,
              },
            },
          ],
        },
      });
      if (existingCollege) {
        return res
          .status(409)
          .json({ error: { message: "College name is already used" } });
      }
      const college = await prisma.college.update({
        where: {
          id: id as string,
        },
        data: {
          name,
        },
      });

      return res.json(college);
    } catch (error: any) {
      logger.error(error);
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
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
