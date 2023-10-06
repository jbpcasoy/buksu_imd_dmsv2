import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError, subject } from "@casl/ability";
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
console.error(error)
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  let ability: AppAbility;
  try {
    const faculty = await prisma.faculty.findFirstOrThrow({
      where: {
        ActiveFaculty: {
          Faculty: {
            userId: {
              equals: user.id,
            },
          },
        },
      },
    });

    ability = iMAbility(user, faculty);
  } catch (error) {
console.error(error)
    return res.status(400).json({ error });
  }

  const getHandler = async () => {
    const validator = Yup.object({
      id: Yup.string().required(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
console.error(error)
      return res.status(400).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const iM = await prisma.iM.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).IM,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(iM);
    } catch (error) {
console.error(error)
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
console.error(error)
      return res.status(400).json({ error });
    }

    const { id } = validator.cast(req.query);

    const iM = await prisma.iM.findFirstOrThrow({
      where: {
        id: {
          equals: id,
        },
      },
    });

    try {
      ForbiddenError.from(ability).throwUnlessCan("delete", subject("IM", iM));
    } catch (error) {
console.error(error)
      return res.status(403).json({ error });
    }

    try {
      const iM = await prisma.iM.delete({
        where: {
          id,
        },
      });

      return res.json(iM);
    } catch (error) {
console.error(error)
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
console.error(error)
      return res.status(400).json({ error });
    }

    const bodyValidator = Yup.object({
      title: Yup.string().required(),
      type: Yup.string()
        .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
        .required(),
    });

    try {
      await bodyValidator.validate(req.body);
    } catch (error) {
console.error(error)
      return res.status(400).json({ error });
    }

    const { id } = queryValidator.cast(req.query);
    const { title, type } = bodyValidator.cast(req.body);

    try {
      const iM = await prisma.iM.update({
        where: {
          id,
        },
        data: {
          title,
          type,
        },
      });

      return res.json(iM);
    } catch (error) {
console.error(error)
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
