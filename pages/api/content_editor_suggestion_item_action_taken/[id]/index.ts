import prisma from "@/prisma/client";
import contentEditorSuggestionItemActionTakenAbility from "@/services/ability/contentEditorSuggestionItemActionTakenAbility";
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
  const ability = contentEditorSuggestionItemActionTakenAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const contentEditorSuggestionItemActionTaken =
        await prisma.contentEditorSuggestionItemActionTaken.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ContentEditorSuggestionItemActionTaken,
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(contentEditorSuggestionItemActionTaken);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "ContentEditorSuggestionItemActionTaken"
      );

      const { id } = validator.cast(req.query);

      const contentEditorSuggestionItemActionTaken =
        await prisma.contentEditorSuggestionItemActionTaken.delete({
          where: {
            id,
          },
        });

      return res.json(contentEditorSuggestionItemActionTaken);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "ContentEditorSuggestionItemActionTaken"
      );

      const { id } = req.query;
      const { value } = validator.cast(req.body);

      const contentEditorSuggestionItemActionTaken =
        await prisma.contentEditorSuggestionItemActionTaken.update({
          where: {
            id: id as string,
          },
          data: {
            value,
          },
        });

      return res.json(contentEditorSuggestionItemActionTaken);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
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
