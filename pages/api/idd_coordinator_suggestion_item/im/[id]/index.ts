import prisma from "@/prisma/client";
import iDDCoordinatorSuggestionItemAbility from "@/services/ability/iDDCoordinatorSuggestionItemAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = iDDCoordinatorSuggestionItemAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);
      const iDDCoordinatorSuggestionItems =
        await prisma.iDDCoordinatorSuggestionItem.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).IDDCoordinatorSuggestionItem,
              {
                IDDCoordinatorSuggestion: {
                  SubmittedIDDCoordinatorSuggestion: {
                    CITLRevision: {
                      some: {
                        IMFile: {
                          IM: {
                            id: {
                              equals: req.query.id as string,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        });
      const count = await prisma.iDDCoordinatorSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).IDDCoordinatorSuggestionItem,
            {
              IDDCoordinatorSuggestion: {
                SubmittedIDDCoordinatorSuggestion: {
                  CITLRevision: {
                    some: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: req.query.id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      });

      return res.json({ iDDCoordinatorSuggestionItems, count });
    } catch (error: any) {
      console.error(error);
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
