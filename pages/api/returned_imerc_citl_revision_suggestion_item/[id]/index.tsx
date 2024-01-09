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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const returnedIMERCCITLRevisionSuggestionItem =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ReturnedIMERCCITLRevisionSuggestionItem,
              {
                id: {
                  equals: id,
                },
              },
            ],
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

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "ReturnedIMERCCITLRevisionSuggestionItem"
      );

      const { id } = validator.cast(req.query);

      const submittedReturnedIMERCCITLRevision =
        await prisma.submittedReturnedIMERCCITLRevision.findFirst({
          where: {
            ReturnedIMERCCITLRevision: {
              ReturnedIMERCCITLRevisionSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        });

      if (submittedReturnedIMERCCITLRevision) {
        return res.status(400).json({
          error: {
            message: "Error: Peer Suggestion is already submitted",
          },
        });
      }

      const returnedIMERCCITLRevisionSuggestionItem =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.delete({
          where: {
            id,
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

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        actionTaken: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "ReturnedIMERCCITLRevisionSuggestionItem"
      );

      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

      const submittedReturnedIMERCCITLRevision =
        await prisma.submittedReturnedIMERCCITLRevision.findFirst({
          where: {
            ReturnedIMERCCITLRevision: {
              ReturnedIMERCCITLRevisionSuggestionItem: {
                some: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        });

      if (submittedReturnedIMERCCITLRevision) {
        return res.status(400).json({
          error: {
            message: "Error: Peer suggestion is already submitted"
          }
        })
      }

      const returnedIMERCCITLRevisionSuggestionItem =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.update({
          where: {
            id: id as string,
          },
          data: {
            actionTaken,
            remarks,
            suggestion,
            pageNumber,
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
