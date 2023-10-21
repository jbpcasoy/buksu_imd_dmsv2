import prisma from "@/prisma/client";
import submittedIDDCoordinatorSuggestionAbility from "@/services/ability/submittedIDDCoordinatorSuggestionAbility";
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
    981;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = submittedIDDCoordinatorSuggestionAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;
      const submittedIDDCoordinatorSuggestion =
        await prisma.submittedIDDCoordinatorSuggestion.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).SubmittedIDDCoordinatorSuggestion,
              {
                IDDCoordinatorSuggestion: {
                  DeanEndorsement: {
                    CoordinatorEndorsement: {
                      DepartmentRevision: {
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
              },
            ],
          },
        });

      return res.json(submittedIDDCoordinatorSuggestion);
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
