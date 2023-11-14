import prisma from "@/prisma/client";
import contentEditorSuggestionItemAbility from "@/services/ability/contentEditorSuggestionItemAbility";
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
  const ability = contentEditorSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        contentEditorSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ContentEditorSuggestionItem"
      );

      const {
        actionTaken,
        contentEditorSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      const submittedContentEditorSuggestion =
        await prisma.submittedContentEditorSuggestion.findFirst({
          where: {
            ContentEditorSuggestion: {
              id: {
                equals: contentEditorSuggestionId,
              },
            },
          },
        });

      if (submittedContentEditorSuggestion) {
        throw new Error("ContentEditor Suggestion is already submitted");
      }

      const contentEditorSuggestionItem =
        await prisma.contentEditorSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ContentEditorSuggestion: {
              connect: {
                id: contentEditorSuggestionId,
              },
            },
          },
        });

      return res.json(contentEditorSuggestionItem);
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
        "filter[contentEditorSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[contentEditorSuggestionId]": filterContentEditorSuggestionId,
      } = validator.cast(req.query);
      const contentEditorSuggestionItems =
        await prisma.contentEditorSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ContentEditorSuggestionItem,
              {
                ContentEditorSuggestion: {
                  id: {
                    equals: filterContentEditorSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.contentEditorSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).ContentEditorSuggestionItem,
            {
              ContentEditorSuggestion: {
                id: {
                  equals: filterContentEditorSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ contentEditorSuggestionItems, count });
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
