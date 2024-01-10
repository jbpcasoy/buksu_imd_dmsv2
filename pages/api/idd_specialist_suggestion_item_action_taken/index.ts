import prisma from "@/prisma/client";
import iDDSpecialistSuggestionItemActionTakenAbility from "@/services/ability/iDDSpecialistSuggestionItemActionTakenAbility";
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
  const ability = iDDSpecialistSuggestionItemActionTakenAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        iDDSpecialistSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IDDSpecialistSuggestionItemActionTaken"
      );

      const { value, iDDSpecialistSuggestionItemId } = validator.cast(req.body);

      const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
        where: {
          IMFile: {
            IMERCCITLRevision: {
              IMERCCITLReviewed: {
                SubmittedIDDSpecialistSuggestion: {
                  IDDSpecialistSuggestion: {
                    IDDSpecialistSuggestionItem: {
                      some: {
                        id: {
                          equals: iDDSpecialistSuggestionItemId,
                        },
                      },
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

      const iDDSpecialistSuggestionItemActionTaken =
        await prisma.iDDSpecialistSuggestionItemActionTaken.create({
          data: {
            value,
            iDDSpecialistSuggestionItemId,
          },
        });

      return res.json(iDDSpecialistSuggestionItemActionTaken);
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

      const {
        skip,
        take,
      } = validator.cast(req.query);

      const iDDSpecialistSuggestionItemActionTakens =
        await prisma.iDDSpecialistSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).IDDSpecialistSuggestionItemActionTaken,
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iDDSpecialistSuggestionItemActionTaken.count({
        where: {
          AND: [
            accessibleBy(ability).IDDSpecialistSuggestionItemActionTaken,
          ],
        },
      });

      return res.json({ iDDSpecialistSuggestionItemActionTakens, count });
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
