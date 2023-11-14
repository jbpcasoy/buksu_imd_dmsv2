import prisma from "@/prisma/client";
import iDDSpecialistSuggestionItemAbility from "@/services/ability/iDDSpecialistSuggestionItemAbility";
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
  const ability = iDDSpecialistSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDSpecialistSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IDDSpecialistSuggestionItem"
      );

      const { actionTaken, iDDSpecialistSuggestionId, remarks, suggestion, pageNumber } =
        validator.cast(req.body);

      const submittedIDDSpecialistSuggestion =
      await prisma.submittedIDDSpecialistSuggestion.findFirst({
        where: {
          IDDSpecialistSuggestion: {
            id: {
              equals: iDDSpecialistSuggestionId,
            },
          },
        },
      });

    if (submittedIDDSpecialistSuggestion) {
      throw new Error("IDDSpecialist Suggestion is already submitted");
    }


      const iDDSpecialistSuggestionItem = await prisma.iDDSpecialistSuggestionItem.create({
        data: {
          actionTaken,
          remarks,
          suggestion,
          pageNumber,
          IDDSpecialistSuggestion: {
            connect: {
              id: iDDSpecialistSuggestionId,
            },
          },
        },
      });

      return res.json(iDDSpecialistSuggestionItem);
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
        "filter[iDDSpecialistSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[iDDSpecialistSuggestionId]": filterIDDSpecialistSuggestionId,
      } = validator.cast(req.query);
      const iDDSpecialistSuggestionItems = await prisma.iDDSpecialistSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).IDDSpecialistSuggestionItem,
            {
              IDDSpecialistSuggestion: {
                id: {
                  equals: filterIDDSpecialistSuggestionId,
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.iDDSpecialistSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).IDDSpecialistSuggestionItem,
            {
              IDDSpecialistSuggestion: {
                id: {
                  equals: filterIDDSpecialistSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ iDDSpecialistSuggestionItems, count });
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
