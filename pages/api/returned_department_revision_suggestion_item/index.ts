import prisma from "@/prisma/client";
import returnedDepartmentRevisionSuggestionItemAbility from "@/services/ability/returnedDepartmentRevisionSuggestionItemAbility";
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
  const ability = returnedDepartmentRevisionSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedDepartmentRevisionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ReturnedDepartmentRevisionSuggestionItem"
      );

      const {
        actionTaken,
        returnedDepartmentRevisionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);

      const returnedDepartmentRevisionSuggestionItem =
        await prisma.returnedDepartmentRevisionSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            ReturnedDepartmentRevision: {
              connect: {
                id: returnedDepartmentRevisionId,
              },
            },
          },
        });

      return res.json(returnedDepartmentRevisionSuggestionItem);
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
        "filter[returnedDepartmentRevisionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[returnedDepartmentRevisionId]":
          filterReturnedDepartmentRevisionId,
      } = validator.cast(req.query);
      const returnedDepartmentRevisionSuggestionItems =
        await prisma.returnedDepartmentRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ReturnedDepartmentRevisionSuggestionItem,
              {
                ReturnedDepartmentRevision: {
                  id: {
                    equals: filterReturnedDepartmentRevisionId,
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedDepartmentRevisionSuggestionItem.count(
        {
          where: {
            AND: [
              accessibleBy(ability).ReturnedDepartmentRevisionSuggestionItem,
              {
                ReturnedDepartmentRevision: {
                  id: {
                    equals: filterReturnedDepartmentRevisionId,
                  },
                },
              },
            ],
          },
        }
      );

      return res.json({ returnedDepartmentRevisionSuggestionItems, count });
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
