import prisma from "@/prisma/client";
import chairpersonSuggestionAbility from "@/services/ability/chairpersonSuggestionAbility";
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
  const ability = chairpersonSuggestionAbility({ user });

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
      const chairpersonSuggestion = await prisma.chairpersonSuggestion.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ChairpersonSuggestion,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(chairpersonSuggestion);
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
      ForbiddenError.from(ability).throwUnlessCan("delete", "ChairpersonSuggestion");
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const chairpersonSuggestion = await prisma.chairpersonSuggestion.delete({
        where: {
          id,
        },
      });

      return res.json(chairpersonSuggestion);
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
