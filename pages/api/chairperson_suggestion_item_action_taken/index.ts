import prisma from "@/prisma/client";
import chairpersonSuggestionItemActionTakenAbility from "@/services/ability/chairpersonSuggestionItemActionTakenAbility";
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
  const ability = chairpersonSuggestionItemActionTakenAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        chairpersonSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ChairpersonSuggestionItemActionTaken"
      );

      const { value, chairpersonSuggestionItemId } = validator.cast(req.body);

      const chairpersonSuggestionItemActionTaken =
        await prisma.chairpersonSuggestionItemActionTaken.create({
          data: {
            value,
            chairpersonSuggestionItemId,
          },
        });

      return res.json(chairpersonSuggestionItemActionTaken);
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

      const chairpersonSuggestionItemActionTakens =
        await prisma.chairpersonSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ChairpersonSuggestionItemActionTaken,
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.chairpersonSuggestionItemActionTaken.count({
        where: {
          AND: [
            accessibleBy(ability).ChairpersonSuggestionItemActionTaken,
          ],
        },
      });

      return res.json({ chairpersonSuggestionItemActionTakens, count });
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
