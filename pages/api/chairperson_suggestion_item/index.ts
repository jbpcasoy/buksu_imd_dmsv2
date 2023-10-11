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

  const postHandler = async () => {
    const validator = Yup.object({
      chairpersonSuggestionId: Yup.string().required(),
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
        "create",
        "ChairpersonSuggestionItem"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { actionTaken, chairpersonSuggestionId, remarks, suggestion } =
      validator.cast(req.body);
    try {
      const chairpersonSuggestionItem = await prisma.chairpersonSuggestionItem.create({
        data: {
          actionTaken,
          remarks,
          suggestion,
          ChairpersonSuggestion: {
            connect: {
              id: chairpersonSuggestionId,
            },
          },
        },
      });

      return res.json(chairpersonSuggestionItem);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const getHandler = async () => {
    const validator = Yup.object({
      take: Yup.number().required(),
      skip: Yup.number().required(),
      "filter[name]": Yup.string().optional(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const {
      skip,
      take,
      "filter[name]": filterName,
    } = validator.cast(req.query);
    console.log({ filterName });
    try {
      const chairpersonSuggestionItems = await prisma.chairpersonSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).ChairpersonSuggestionItem],
        },
      });
      const count = await prisma.chairpersonSuggestionItem.count({
        where: {
          AND: [accessibleBy(ability).ChairpersonSuggestionItem],
        },
      });

      return res.json({ chairpersonSuggestionItems, count });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
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
