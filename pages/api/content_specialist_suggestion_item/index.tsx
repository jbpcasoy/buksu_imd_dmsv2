import prisma from "@/prisma/client";
import contentSpecialistSuggestionItemAbility from "@/services/ability/contentSpecialistSuggestionItemAbility";
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
  const ability = contentSpecialistSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        contentSpecialistSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ContentSpecialistSuggestionItem"
      );

      const { actionTaken, contentSpecialistSuggestionId, remarks, suggestion, pageNumber } =
        validator.cast(req.body);

      const contentSpecialistSuggestionItem = await prisma.contentSpecialistSuggestionItem.create({
        data: {
          actionTaken,
          remarks,
          suggestion,
          pageNumber,
          ContentSpecialistSuggestion: {
            connect: {
              id: contentSpecialistSuggestionId,
            },
          },
        },
      });

      return res.json(contentSpecialistSuggestionItem);
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
        "filter[contentSpecialistSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[contentSpecialistSuggestionId]": filterContentSpecialistSuggestionId,
      } = validator.cast(req.query);
      const contentSpecialistSuggestionItems = await prisma.contentSpecialistSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ContentSpecialistSuggestionItem,
            {
              ContentSpecialistSuggestion: {
                id: {
                  equals: filterContentSpecialistSuggestionId,
                },
              },
            },
          ],
        },
      });
      const count = await prisma.contentSpecialistSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).ContentSpecialistSuggestionItem,
            {
              ContentSpecialistSuggestion: {
                id: {
                  equals: filterContentSpecialistSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ contentSpecialistSuggestionItems, count });
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
