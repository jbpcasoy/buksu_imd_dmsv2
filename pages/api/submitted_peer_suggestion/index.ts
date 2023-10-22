import prisma from "@/prisma/client";
import submittedPeerSuggestionAbility from "@/services/ability/submittedPeerSuggestionAbility";
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
  const ability = submittedPeerSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        peerSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedPeerSuggestion"
      );
      const { peerSuggestionId } = validator.cast(req.body);
      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.create({
          data: {
            PeerSuggestion: {
              connect: {
                id: peerSuggestionId as string,
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
                  PeerReview: {
                    PeerSuggestion: {
                      SubmittedPeerSuggestion: {
                        id: {
                          equals: submittedPeerSuggestion.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.findFirst({
          where: {
            ChairpersonSuggestion: {
              ChairpersonReview: {
                DepartmentReview: {
                  PeerReview: {
                    PeerSuggestion: {
                      SubmittedPeerSuggestion: {
                        id: {
                          equals: submittedPeerSuggestion.id,
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
          },
        });
      }

      return res.json(submittedPeerSuggestion);
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

      const submittedPeerSuggestions =
        await prisma.submittedPeerSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).SubmittedPeerSuggestion],
          },
        });
      const count = await prisma.submittedPeerSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedPeerSuggestion],
        },
      });

      return res.json({ submittedPeerSuggestions, count });
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
