import prisma from "@/prisma/client";
import chairpersonSuggestionItemAbility from "@/services/ability/chairpersonSuggestionItemAbility";
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
  const ability = chairpersonSuggestionItemAbility({ user });

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
      const chairpersonSuggestionItem =
        await prisma.chairpersonSuggestionItem.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ChairpersonSuggestionItem,
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(chairpersonSuggestionItem);
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
      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "ChairpersonSuggestionItem"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const chairpersonSuggestionItem = await prisma.chairpersonSuggestionItem.delete({
        where: {
          id,
        },
      });

      return res.json(chairpersonSuggestionItem);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const putHandler = async () => {
    const validator = Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string().optional(),
      remarks: Yup.string().optional(),
    });

    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "ChairpersonSuggestionItem"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }
    const { id } = req.query;
    const { actionTaken, remarks, suggestion } = validator.cast(req.body);

    try {
      const chairpersonSuggestionItem = await prisma.chairpersonSuggestionItem.update({
        where: {
          id: id as string,
        },
        data: {
          actionTaken,
          remarks,
          suggestion,
        },
      });

      return res.json(chairpersonSuggestionItem);
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
