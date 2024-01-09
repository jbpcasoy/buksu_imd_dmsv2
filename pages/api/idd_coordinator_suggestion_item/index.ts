import prisma from "@/prisma/client";
import iDDCoordinatorSuggestionItemAbility from "@/services/ability/iDDCoordinatorSuggestionItemAbility";
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
  const ability = iDDCoordinatorSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDCoordinatorSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IDDCoordinatorSuggestionItem"
      );

      const {
        actionTaken,
        iDDCoordinatorSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.findFirst({
          where: {
            IDDCoordinatorSuggestion: {
              id: {
                equals: iDDCoordinatorSuggestionId,
              },
            },
          },
        });

      if (submittedIDDCoordinatorSuggestion) {
        return res.status(400).json({
          error: {
            message: "Error: IDD coordinator Suggestion is already submitted",
          },
        });
      }

      const iDDCoordinatorSuggestionItem =
        await prisma.iDDCoordinatorSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            IDDCoordinatorSuggestion: {
              connect: {
                id: iDDCoordinatorSuggestionId,
              },
            },
          },
        });

      return res.json(iDDCoordinatorSuggestionItem);
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
        "filter[iDDCoordinatorSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[iDDCoordinatorSuggestionId]": filterIDDCoordinatorSuggestionId,
      } = validator.cast(req.query);
      const iDDCoordinatorSuggestionItems =
        await prisma.iDDCoordinatorSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).IDDCoordinatorSuggestionItem,
              {
                IDDCoordinatorSuggestion: {
                  id: {
                    equals: filterIDDCoordinatorSuggestionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDCoordinatorSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).IDDCoordinatorSuggestionItem,
            {
              IDDCoordinatorSuggestion: {
                id: {
                  equals: filterIDDCoordinatorSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ iDDCoordinatorSuggestionItems, count });
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
