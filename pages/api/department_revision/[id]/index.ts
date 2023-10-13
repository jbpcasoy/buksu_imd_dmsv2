import prisma from "@/prisma/client";
import departmentRevisionAbility from "@/services/ability/departmentRevisionAbility";
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
  const ability = departmentRevisionAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const departmentRevision =
        await prisma.departmentRevision.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).DepartmentRevision,
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(departmentRevision);
    } catch (error: any) {
      console.error(error);
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

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "DepartmentRevision"
      );

      const { id } = validator.cast(req.query);

      const departmentRevision = await prisma.departmentRevision.delete({
        where: {
          id,
        },
      });

      return res.json(departmentRevision);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        returned: Yup.boolean().required(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "DepartmentRevision"
      );

      const { id } = req.query;
      const { returned } = validator.cast(req.body);

      const departmentRevision = await prisma.departmentRevision.update({
        where: {
          id: id as string,
        },
        data: {
          returned,
        },
      });

      return res.json(departmentRevision);
    } catch (error: any) {
      console.error(error);
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
