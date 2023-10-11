import prisma from "@/prisma/client";
import submittedChairpersonSuggestionAbility from "@/services/ability/submittedChairpersonSuggestionAbility";
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
  const ability = submittedChairpersonSuggestionAbility({ user });

  const postHandler = async () => {
    const validator = Yup.object({
      chairpersonSuggestionId: Yup.string().required(),
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
        "SubmittedChairpersonSuggestion"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { chairpersonSuggestionId } = validator.cast(req.body);
    try {
      const submittedChairpersonSuggestion = await prisma.submittedChairpersonSuggestion.create({
        data: {
          ChairpersonSuggestion: {
            connect: {
              id: chairpersonSuggestionId as string,
            },
          },
        },
      });

      return res.json(submittedChairpersonSuggestion);
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
      const submittedChairpersonSuggestions = await prisma.submittedChairpersonSuggestion.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).SubmittedChairpersonSuggestion],
        },
      });
      const count = await prisma.submittedChairpersonSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedChairpersonSuggestion],
        },
      });

      return res.json({ submittedChairpersonSuggestions, count });
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
