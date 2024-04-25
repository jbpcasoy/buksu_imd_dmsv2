import prisma from "@/prisma/client";
import { readDepartment, updateDepartment } from "@/services/departmentService";
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
      const id = req.query.id as string;

      const department = await readDepartment({ id });

      return res.json(department);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const id = req.query.id as string;

      if (!user.isAdmin) {
        return res.status(403).json({
          error: { message: "You are not allowed to delete this department" },
        });
      }

      const department = await prisma.department.delete({
        where: {
          id,
        },
      });

      return res.json(department);
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
      const id = req.query.id as string;
      const { name } = validator.cast(req.body);
      const department = await updateDepartment({ id, name, user });

      return res.json(department);
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
