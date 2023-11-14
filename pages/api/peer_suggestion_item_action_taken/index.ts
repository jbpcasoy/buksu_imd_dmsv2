import prisma from "@/prisma/client";
import peerSuggestionItemActionTakenAbility from "@/services/ability/peerSuggestionItemActionTakenAbility";
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
  const ability = peerSuggestionItemActionTakenAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        value: Yup.string().required(),
        peerSuggestionItemId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "PeerSuggestionItemActionTaken"
      );

      const { value, peerSuggestionItemId } = validator.cast(req.body);

      const departmentRevision = await prisma.departmentRevision.findFirst({
        where: {
          IMFile: {
            DepartmentReview: {
              PeerReview: {
                PeerSuggestion: {
                  PeerSuggestionItem: {
                    some: {
                      id: {
                        equals: peerSuggestionItemId,
                      },
                    },
                  },
                },
              },
            },
          },
          OR: [
            {
              ReturnedDepartmentRevision: {
                is: null,
              },
            },
            {
              ReturnedDepartmentRevision: {
                SubmittedReturnedDepartmentRevision: {
                  is: null,
                },
              },
            },
          ],
        },
      });
      if (departmentRevision) {
        throw new Error("IM already revised.");
      }
      
      const peerSuggestionItemActionTaken =
        await prisma.peerSuggestionItemActionTaken.create({
          data: {
            value,
            peerSuggestionItemId,
          },
        });

      return res.json(peerSuggestionItemActionTaken);
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
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
      } = validator.cast(req.query);

      const peerSuggestionItemActionTakens =
        await prisma.peerSuggestionItemActionTaken.findMany({
          skip,
          take,
          where: {
            AND: [
              accessibleBy(ability).PeerSuggestionItemActionTaken,
            ],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.peerSuggestionItemActionTaken.count({
        where: {
          AND: [
            accessibleBy(ability).PeerSuggestionItemActionTaken,
          ],
        },
      });

      return res.json({ peerSuggestionItemActionTakens, count });
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
