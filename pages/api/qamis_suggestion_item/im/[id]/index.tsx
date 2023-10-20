import prisma from "@/prisma/client";
import qAMISSuggestionItemAbility from "@/services/ability/qAMISSuggestionItemAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = qAMISSuggestionItemAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        take: Yup.number().required(),
        skip: Yup.number().required(),
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);
      const qAMISSuggestionItems = await prisma.qAMISSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).QAMISSuggestionItem,
            {
              QAMISSuggestion: {
                SubmittedQAMISSuggestion: {
                  QAMISRevision: {
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
          ],
        },
      });
      const count = await prisma.qAMISSuggestionItem.count({
        where: {
          AND: [
            accessibleBy(ability).QAMISSuggestionItem,
            {
              QAMISSuggestion: {
                SubmittedQAMISSuggestion: {
                  QAMISRevision: {
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
          ],
        },
      });

      return res.json({ qAMISSuggestionItems, count });
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
