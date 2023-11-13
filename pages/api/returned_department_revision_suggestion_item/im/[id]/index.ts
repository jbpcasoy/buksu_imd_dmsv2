import prisma from "@/prisma/client";
import returnedDepartmentRevisionSuggestionItemAbility from "@/services/ability/returnedDepartmentRevisionSuggestionItemAbility";
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
  const ability = returnedDepartmentRevisionSuggestionItemAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);
      const returnedDepartmentRevisionSuggestionItems =
        await prisma.returnedDepartmentRevisionSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).ReturnedDepartmentRevisionSuggestionItem,
              {
                ReturnedDepartmentRevision: {
                  SubmittedReturnedDepartmentRevision: {
                    ReturnedDepartmentRevision: {
                      DepartmentRevision: {
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
              {
                ReturnedDepartmentRevision: {
                  SubmittedReturnedDepartmentRevision: {
                    isNot: null,
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
                  SubmittedReturnedDepartmentRevision: {
                    ReturnedDepartmentRevision: {
                      DepartmentRevision: {
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
              {
                ReturnedDepartmentRevision: {
                  SubmittedReturnedDepartmentRevision: {
                    isNot: null,
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
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
