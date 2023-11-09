import prisma from "@/prisma/client";
import returnedCITLRevisionSuggestionItemAbility from "@/services/ability/returnedCITLRevisionSuggestionItemAbility";
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
  const ability = returnedCITLRevisionSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedCITLRevisionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ReturnedCITLRevisionSuggestionItem"
      );

      const {
        actionTaken,
        returnedCITLRevisionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      const returnedCITLRevisionSuggestionItem =
        await prisma.returnedCITLRevisionSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ReturnedCITLRevision: {
              connect: {
                id: returnedCITLRevisionId,
              },
            },
          },
        });

      return res.json(returnedCITLRevisionSuggestionItem);
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
        "filter[returnedCITLRevisionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[returnedCITLRevisionId]":
          filterReturnedCITLRevisionId,
      } = validator.cast(req.query);
      const returnedCITLRevisionSuggestionItems =
        await prisma.returnedCITLRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ReturnedCITLRevisionSuggestionItem,
              {
                ReturnedCITLRevision: {
                  id: {
                    equals: filterReturnedCITLRevisionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedCITLRevisionSuggestionItem.count(
        {
          where: {
            AND: [
              accessibleBy(ability).ReturnedCITLRevisionSuggestionItem,
              {
                ReturnedCITLRevision: {
                  id: {
                    equals: filterReturnedCITLRevisionId,
                  },
                },
              },
            ],
          },
        }
      );

      return res.json({ returnedCITLRevisionSuggestionItems, count });
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
