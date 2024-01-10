import prisma from "@/prisma/client";
import contentSpecialistSuggestionItemActionTakenAbility from "@/services/ability/contentSpecialistSuggestionItemActionTakenAbility";
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
  const ability = contentSpecialistSuggestionItemActionTakenAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        contentSpecialistSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ContentSpecialistSuggestionItemActionTaken"
      );

      const { value, contentSpecialistSuggestionItemId } = validator.cast(
        req.body
      );

      const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
        where: {
          IMFile: {
            IMERCCITLRevision: {
              IMERCCITLReviewed: {
                SubmittedContentSpecialistSuggestion: {
                  ContentSpecialistSuggestion: {
                    ContentSpecialistSuggestionItem: {
                      some: {
                        id: {
                          equals: contentSpecialistSuggestionItemId,
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

      const contentSpecialistSuggestionItemActionTaken =
        await prisma.contentSpecialistSuggestionItemActionTaken.create({
          data: {
            value,
            contentSpecialistSuggestionItemId,
          },
        });

      return res.json(contentSpecialistSuggestionItemActionTaken);
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

      const contentSpecialistSuggestionItemActionTakens =
        await prisma.contentSpecialistSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ContentSpecialistSuggestionItemActionTaken,
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count =
        await prisma.contentSpecialistSuggestionItemActionTaken.count({
          where: {
            AND: [
              accessibleBy(ability).ContentSpecialistSuggestionItemActionTaken,
            ],
          },
        });

      return res.json({ contentSpecialistSuggestionItemActionTakens, count });
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
