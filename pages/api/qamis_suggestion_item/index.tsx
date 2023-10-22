import prisma from "@/prisma/client";
import qAMISSuggestionItemAbility from "@/services/ability/qAMISSuggestionItemAbility";
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
  const ability = qAMISSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        qAMISSuggestionId: Yup.string().required(),
        pageNumber: Yup.number().min(0).required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "QAMISSuggestionItem"
      );

      const {
        actionTaken,
        qAMISSuggestionId,
        remarks,
        suggestion,
        pageNumber,
      } = validator.cast(req.body);
      const qAMISSuggestionItem =
        await prisma.qAMISSuggestionItem.create({
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
            QAMISSuggestion: {
              connect: {
                id: qAMISSuggestionId,
              },
            },
          },
        });

      return res.json(qAMISSuggestionItem);
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
        "filter[qAMISSuggestionId]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[qAMISSuggestionId]": filterQAMISSuggestionId,
      } = validator.cast(req.query);
      const qAMISSuggestionItems = await prisma.qAMISSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).QAMISSuggestionItem,
            {
              QAMISSuggestion: {
                id: {
                  equals: filterQAMISSuggestionId,
                },
              },
            },
          ],
        },
      });
      const count = await prisma.qAMISSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).QAMISSuggestionItem,
            {
              QAMISSuggestion: {
                id: {
                  equals: filterQAMISSuggestionId,
                },
              },
            },
          ],
        },
      });

      return res.json({ qAMISSuggestionItems, count });
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
