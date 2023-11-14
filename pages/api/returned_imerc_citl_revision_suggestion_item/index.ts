import prisma from "@/prisma/client";
import returnedIMERCCITLRevisionSuggestionItemAbility from "@/services/ability/returnedIMERCCITLRevisionSuggestionItemAbility";
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
  const ability = returnedIMERCCITLRevisionSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedIMERCCITLRevisionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ReturnedIMERCCITLRevisionSuggestionItem"
      );

      const {
        actionTaken,
        returnedIMERCCITLRevisionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      const submittedReturnedIMERCCITLRevision =
        await prisma.submittedReturnedIMERCCITLRevision.findFirst({
          where: {
            ReturnedIMERCCITLRevision: {
              id: {
                equals: returnedIMERCCITLRevisionId,
              },
            },
          },
        });

      if (submittedReturnedIMERCCITLRevision) {
        throw new Error("Peer Suggestion is already submitted");
      }

      const returnedIMERCCITLRevisionSuggestionItem =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ReturnedIMERCCITLRevision: {
              connect: {
                id: returnedIMERCCITLRevisionId,
              },
            },
          },
        });

      return res.json(returnedIMERCCITLRevisionSuggestionItem);
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
        "filter[returnedIMERCCITLRevisionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[returnedIMERCCITLRevisionId]":
          filterReturnedIMERCCITLRevisionId,
      } = validator.cast(req.query);
      const returnedIMERCCITLRevisionSuggestionItems =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ReturnedIMERCCITLRevisionSuggestionItem,
              {
                ReturnedIMERCCITLRevision: {
                  id: {
                    equals: filterReturnedIMERCCITLRevisionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedIMERCCITLRevisionSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).ReturnedIMERCCITLRevisionSuggestionItem,
            {
              ReturnedIMERCCITLRevision: {
                id: {
                  equals: filterReturnedIMERCCITLRevisionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ returnedIMERCCITLRevisionSuggestionItems, count });
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
