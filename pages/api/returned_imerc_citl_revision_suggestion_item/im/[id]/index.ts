import prisma from "@/prisma/client";
import returnedIMERCCITLRevisionSuggestionItemAbility from "@/services/ability/returnedIMERCCITLRevisionSuggestionItemAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);
      const returnedIMERCCITLRevisionSuggestionItems =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ReturnedIMERCCITLRevisionSuggestionItem,
              {
                ReturnedIMERCCITLRevision: {
                  SubmittedReturnedIMERCCITLRevision: {
                    ReturnedIMERCCITLRevision: {
                      IMERCCITLRevision: {
                        IMFile: {
                          IM: {
                            id: req.query.id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedIMERCCITLRevisionSuggestionItem.count(
        {
          where: {
            AND: [
              accessibleBy(ability).ReturnedIMERCCITLRevisionSuggestionItem,
              {
                ReturnedIMERCCITLRevision: {
                  SubmittedReturnedIMERCCITLRevision: {
                    ReturnedIMERCCITLRevision: {
                      IMERCCITLRevision: {
                        IMFile: {
                          IM: {
                            id: req.query.id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        }
      );

      return res.json({ returnedIMERCCITLRevisionSuggestionItems, count });
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}