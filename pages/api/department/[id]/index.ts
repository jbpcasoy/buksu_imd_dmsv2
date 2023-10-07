import prisma from "@/prisma/client";
import departmentAbility from "@/services/ability/departmentAbility";
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

  const ability = departmentAbility({user});

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
      const department = await prisma.department.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).Department,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(department);
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
      ForbiddenError.from(ability).throwUnlessCan("delete", "Department");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
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

    try {
      ForbiddenError.from(ability).throwUnlessCan("update", "Department");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { id } = queryValidator.cast(req.query);
    const { name } = bodyValidator.cast(req.body);

    try {
      const college = await prisma.department.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return res.json(college);
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
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
