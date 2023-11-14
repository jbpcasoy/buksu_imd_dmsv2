import prisma from "@/prisma/client";
import chairpersonSuggestionItemAbility from "@/services/ability/chairpersonSuggestionItemAbility";
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
  const ability = chairpersonSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        chairpersonSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ChairpersonSuggestionItem"
      );

      const {
        actionTaken,
        chairpersonSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.findFirst({
          where: {
            ChairpersonSuggestion: {
              id: {
                equals: chairpersonSuggestionId,
              },
            },
          },
        });

      if (submittedChairpersonSuggestion) {
        throw new Error("Chairperson Suggestion is already submitted");
      }

      const chairpersonSuggestionItem =
        await prisma.chairpersonSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ChairpersonSuggestion: {
              connect: {
                id: chairpersonSuggestionId,
              },
            },
          },
        });

      return res.json(chairpersonSuggestionItem);
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
        "filter[chairpersonSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[chairpersonSuggestionId]": filterChairpersonSuggestionId,
      } = validator.cast(req.query);
      const chairpersonSuggestionItems = await prisma.chairpersonSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ChairpersonSuggestionItem,
            {
              ChairpersonSuggestion: {
                id: {
                  equals: filterChairpersonSuggestionId,
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.chairpersonSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).ChairpersonSuggestionItem,
            {
              ChairpersonSuggestion: {
                id: {
                  equals: filterChairpersonSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ chairpersonSuggestionItems, count });
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
