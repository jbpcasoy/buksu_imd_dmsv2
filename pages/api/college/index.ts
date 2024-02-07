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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        name: Yup.string().required(),
      });
      await validator.validate(req.body);

      if (!user.isAdmin) {
        return res
          .status(403)
          .json({
            error: { message: "You are not allowed to create a college" },
          });
      }

      const { name } = validator.cast(req.body);

      const existingCollege = await prisma.college.findFirst({
        where: {
          name: {
            equals: name,
          },
        },
      });
      if (existingCollege) {
        return res
          .status(409)
          .json({ error: { message: "College name is already used" } });
      }

      const college = await prisma.college.create({
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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
        "filter[name]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);

      const colleges = await prisma.college.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              name: {
                contains: filterName,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          [sortField || "name"]: sortDirection || "asc",
        },
      });
      const count = await prisma.college.count({
        where: {
          AND: [
            {
              name: {
                contains: filterName,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return res.json({ colleges, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
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
