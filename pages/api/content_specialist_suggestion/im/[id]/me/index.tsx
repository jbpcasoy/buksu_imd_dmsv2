import prisma from "@/prisma/client";
import contentSpecialistSuggestionAbility from "@/services/ability/contentSpecialistSuggestionAbility";
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
  const ability = contentSpecialistSuggestionAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });
      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const contentSpecialistSuggestion =
        await prisma.contentSpecialistSuggestion.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ContentSpecialistSuggestion,
              {
                ContentSpecialistReview: {
                  ContentSpecialist: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                  QAMISDepartmentEndorsement: {
                    AND: [
                      {
                        QAMISChairpersonEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
                                id: {
                                  equals: id,
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        QAMISCoordinatorEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
                                id: {
                                  equals: id,
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        QAMISDeanEndorsement: {
                          QAMISRevision: {
                            IMFile: {
                              IM: {
                                id: {
                                  equals: id,
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        });

      return res.json(contentSpecialistSuggestion);
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
