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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const iDDSpecialistSuggestionItemActionTaken =
        await prisma.iDDSpecialistSuggestionItemActionTaken.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).IDDSpecialistSuggestionItemActionTaken,
              {
                id: {
                  equals: id,
                },
              },
            ],
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

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "IDDSpecialistSuggestionItemActionTaken"
      );

      const { id } = validator.cast(req.query);

      const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
        where: {
          IMFile: {
            IMERCCITLRevision: {
              IMERCCITLReviewed: {
                SubmittedIDDSpecialistSuggestion: {
                  IDDSpecialistSuggestion: {
                    IDDSpecialistSuggestionItem: {
                      some: {
                        IDDSpecialistSuggestionItemActionTaken: {
                          id: {
                            equals: id,
                          },
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
        await prisma.iDDSpecialistSuggestionItemActionTaken.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "IDDSpecialistSuggestionItemActionTaken"
      );

      const { id } = req.query;
      const { value } = validator.cast(req.body);

      const iDDSpecialistSuggestionItemActionTaken =
        await prisma.iDDSpecialistSuggestionItemActionTaken.update({
          where: {
            id: id as string,
          },
          data: {
            value,
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

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
