import prisma from "@/prisma/client";
import submittedChairpersonSuggestionAbility from "@/services/ability/submittedChairpersonSuggestionAbility";
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
  const ability = submittedChairpersonSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        chairpersonSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedChairpersonSuggestion"
      );

      const { chairpersonSuggestionId } = validator.cast(req.body);

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.create({
          data: {
            ChairpersonSuggestion: {
              connect: {
                id: chairpersonSuggestionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_CHAIRPERSON_SUGGESTION_CREATED",
              },
            },
          },
        });

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              PeerReview: {
                DepartmentReview: {
                  ChairpersonReview: {
                    ChairpersonSuggestion: {
                      SubmittedChairpersonSuggestion: {
                        id: {
                          equals: submittedChairpersonSuggestion.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const submittedCoordinatorSuggestion =
        await prisma.submittedCoordinatorSuggestion.findFirst({
          where: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  ChairpersonReview: {
                    ChairpersonSuggestion: {
                      SubmittedChairpersonSuggestion: {
                        id: {
                          equals: submittedChairpersonSuggestion.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      if (
        submittedChairpersonSuggestion &&
        submittedPeerSuggestion &&
        submittedCoordinatorSuggestion
      ) {
        await prisma.departmentReviewed.create({
          data: {
            SubmittedChairpersonSuggestion: {
              connect: {
                id: submittedChairpersonSuggestion.id,
              },
            },
            SubmittedCoordinatorSuggestion: {
              connect: {
                id: submittedCoordinatorSuggestion.id,
              },
            },
            SubmittedPeerSuggestion: {
              connect: {
                id: submittedPeerSuggestion.id,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "DEPARTMENT_REVIEWED_CREATED",
              },
            },
          },
        });
      }

      return res.json(submittedChairpersonSuggestion);
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
        "filter[name]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
      } = validator.cast(req.query);
      const submittedChairpersonSuggestions =
        await prisma.submittedChairpersonSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).SubmittedChairpersonSuggestion],
          },
        });
      const count = await prisma.submittedChairpersonSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedChairpersonSuggestion],
        },
      });

      return res.json({ submittedChairpersonSuggestions, count });
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
