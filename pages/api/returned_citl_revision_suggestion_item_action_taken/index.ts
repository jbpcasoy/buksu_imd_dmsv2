import prisma from "@/prisma/client";
import returnedCITLRevisionSuggestionItemActionTakenAbility from "@/services/ability/returnedCITLRevisionSuggestionItemActionTakenAbility";
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
  const ability = returnedCITLRevisionSuggestionItemActionTakenAbility({
    user,
  });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        returnedCITLRevisionSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ReturnedCITLRevisionSuggestionItemActionTaken"
      );

      const { value, returnedCITLRevisionSuggestionItemId } = validator.cast(
        req.body
      );

      const cITLRevision = await prisma.cITLRevision.findFirst({
        where: {
          IMFile: {
            CITLRevision: {
              ReturnedCITLRevision: {
                ReturnedCITLRevisionSuggestionItem: {
                  some: {
                    id: {
                      equals: returnedCITLRevisionSuggestionItemId,
                    },
                  },
                },
              },
            },
          },
          OR: [
            {
              ReturnedCITLRevision: {
                is: null,
              },
            },
            {
              ReturnedCITLRevision: {
                SubmittedReturnedCITLRevision: {
                  is: null,
                },
              },
            },
          ],
        },
      });
      if (cITLRevision) {
        throw new Error("IM already revised.");
      }

      const returnedCITLRevisionSuggestionItemActionTaken =
        await prisma.returnedCITLRevisionSuggestionItemActionTaken.create({
          data: {
            value,
            returnedCITLRevisionSuggestionItemId,
          },
        });

      return res.json(returnedCITLRevisionSuggestionItemActionTaken);
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
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const returnedCITLRevisionSuggestionItemActionTakens =
        await prisma.returnedCITLRevisionSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability)
                .ReturnedCITLRevisionSuggestionItemActionTaken,
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count =
        await prisma.returnedCITLRevisionSuggestionItemActionTaken.count({
          where: {
            AND: [
              accessibleBy(ability)
                .ReturnedCITLRevisionSuggestionItemActionTaken,
            ],
          },
        });

      return res.json({
        returnedCITLRevisionSuggestionItemActionTakens,
        count,
      });
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
