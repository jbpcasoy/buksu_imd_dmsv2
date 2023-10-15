import prisma from "@/prisma/client";
import iDDSpecialistSuggestionAbility from "@/services/ability/iDDSpecialistSuggestionAbility";
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
  const ability = iDDSpecialistSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDSpecialistReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "IDDSpecialistSuggestion");

      const { iDDSpecialistReviewId } = validator.cast(req.body);

      const iDDSpecialistSuggestion = await prisma.iDDSpecialistSuggestion.create({
        data: {
          IDDSpecialistReview: {
            connect: {
              id: iDDSpecialistReviewId,
            },
          },
        },
      });

      return res.json(iDDSpecialistSuggestion);
    } catch (error: any) {
      console.error(error);
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
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);
      console.log({ filterName });

      const iDDSpecialistSuggestions = await prisma.iDDSpecialistSuggestion.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).IDDSpecialistSuggestion],
        },
      });
      const count = await prisma.iDDSpecialistSuggestion.count({
        where: {
          AND: [accessibleBy(ability).IDDSpecialistSuggestion],
        },
      });

      return res.json({ iDDSpecialistSuggestions, count });
    } catch (error: any) {
      console.error(error);
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
