import prisma from "@/prisma/client";
import submittedIDDCoordinatorSuggestionAbility from "@/services/ability/submittedIDDCoordinatorSuggestionAbility";
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
  const ability = submittedIDDCoordinatorSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDCoordinatorSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedIDDCoordinatorSuggestion"
      );

      const { iDDCoordinatorSuggestionId } = validator.cast(req.body);

      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.create({
          data: {
            IDDCoordinatorSuggestion: {
              connect: {
                id: iDDCoordinatorSuggestionId as string,
              },
            },
          },
        });

      return res.json(submittedIDDCoordinatorSuggestion);
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
      const submittedIDDCoordinatorSuggestions =
        await prisma.submittedIDDCoordinatorSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).SubmittedIDDCoordinatorSuggestion],
          },
        });
      const count = await prisma.submittedIDDCoordinatorSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedIDDCoordinatorSuggestion],
        },
      });

      return res.json({ submittedIDDCoordinatorSuggestions, count });
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
