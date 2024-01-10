import prisma from "@/prisma/client";
import returnedIMERCCITLRevisionSuggestionItemActionTakenAbility from "@/services/ability/returnedIMERCCITLRevisionSuggestionItemActionTakenAbility";
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
  const ability = returnedIMERCCITLRevisionSuggestionItemActionTakenAbility({
    user,
  });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        returnedIMERCCITLRevisionSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ReturnedIMERCCITLRevisionSuggestionItemActionTaken"
      );

      const { value, returnedIMERCCITLRevisionSuggestionItemId } =
        validator.cast(req.body);

      const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
        where: {
          IMFile: {
            IMERCCITLRevision: {
              ReturnedIMERCCITLRevision: {
                ReturnedIMERCCITLRevisionSuggestionItem: {
                  some: {
                    id: {
                      equals: returnedIMERCCITLRevisionSuggestionItemId,
                    },
                  },
                },
              },
            },
          },
          OR: [
            {
              ReturnedIMERCCITLRevision: {
                is: null,
              },
            },
            {
              ReturnedIMERCCITLRevision: {
                SubmittedReturnedIMERCCITLRevision: {
                  is: null,
                },
              },
            },
          ],
        },
      });
      if (iMERCCITLRevision) {
        throw new Error("Error: IM is already revised");
      }

      const returnedIMERCCITLRevisionSuggestionItemActionTaken =
        await prisma.returnedIMERCCITLRevisionSuggestionItemActionTaken.create({
          data: {
            value,
            returnedIMERCCITLRevisionSuggestionItemId,
          },
        });

      return res.json(returnedIMERCCITLRevisionSuggestionItemActionTaken);
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

      const returnedIMERCCITLRevisionSuggestionItemActionTakens =
        await prisma.returnedIMERCCITLRevisionSuggestionItemActionTaken.findMany(
          {
            skip,
            take,
            where: {
              AND: [
                accessibleBy(ability)
                  .ReturnedIMERCCITLRevisionSuggestionItemActionTaken,
              ],
            },
            orderBy: {
              updatedAt: "desc",
            },
          }
        );
      const count =
        await prisma.returnedIMERCCITLRevisionSuggestionItemActionTaken.count({
          where: {
            AND: [
              accessibleBy(ability)
                .ReturnedIMERCCITLRevisionSuggestionItemActionTaken,
            ],
          },
        });

      return res.json({
        returnedIMERCCITLRevisionSuggestionItemActionTakens,
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
