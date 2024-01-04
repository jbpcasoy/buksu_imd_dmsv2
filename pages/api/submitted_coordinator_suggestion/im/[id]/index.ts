import prisma from "@/prisma/client";
import submittedCoordinatorSuggestionAbility from "@/services/ability/submittedCoordinatorSuggestionAbility";
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
  const ability = submittedCoordinatorSuggestionAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const submittedCoordinatorSuggestion =
        await prisma.submittedCoordinatorSuggestion.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).SubmittedCoordinatorSuggestion,
              {
                CoordinatorSuggestion: {
                  CoordinatorReview: {
                    DepartmentReview: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
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

      return res.json(submittedCoordinatorSuggestion);
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
