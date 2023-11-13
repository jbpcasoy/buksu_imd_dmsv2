import prisma from "@/prisma/client";
import coordinatorSuggestionItemActionTakenAbility from "@/services/ability/coordinatorSuggestionItemActionTakenAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
    logger.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = coordinatorSuggestionItemActionTakenAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        coordinatorSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "CoordinatorSuggestionItemActionTaken"
      );

      const { value, coordinatorSuggestionItemId } = validator.cast(req.body);

      const coordinatorSuggestionItemActionTaken =
        await prisma.coordinatorSuggestionItemActionTaken.create({
          data: {
            value,
            coordinatorSuggestionItemId,
          },
        });

      return res.json(coordinatorSuggestionItemActionTaken);
    } catch (error: any) {
      logger.error(error);
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
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
      } = validator.cast(req.query);

      const coordinatorSuggestionItemActionTakens =
        await prisma.coordinatorSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).CoordinatorSuggestionItemActionTaken,
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.coordinatorSuggestionItemActionTaken.count({
        where: {
          AND: [
            accessibleBy(ability).CoordinatorSuggestionItemActionTaken,
          ],
        },
      });

      return res.json({ coordinatorSuggestionItemActionTakens, count });
    } catch (error: any) {
      logger.error(error);
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
