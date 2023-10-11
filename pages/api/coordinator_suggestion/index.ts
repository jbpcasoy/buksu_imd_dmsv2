import prisma from "@/prisma/client";
import coordinatorSuggestionAbility from "@/services/ability/coordinatorSuggestionAbility";
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
  const ability = coordinatorSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        coordinatorReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "CoordinatorSuggestion"
      );

      const { coordinatorReviewId } = validator.cast(req.body);

      const coordinatorSuggestion = await prisma.coordinatorSuggestion.create({
        data: {
          CoordinatorReview: {
            connect: {
              id: coordinatorReviewId,
            },
          },
        },
      });

      return res.json(coordinatorSuggestion);
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
      const coordinatorSuggestions =
        await prisma.coordinatorSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).CoordinatorSuggestion],
          },
        });
      const count = await prisma.coordinatorSuggestion.count({
        where: {
          AND: [accessibleBy(ability).CoordinatorSuggestion],
        },
      });

      return res.json({ coordinatorSuggestions, count });
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
