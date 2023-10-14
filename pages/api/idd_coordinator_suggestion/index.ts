import prisma from "@/prisma/client";
import iDDCoordinatorSuggestionAbility from "@/services/ability/iDDCoordinatorSuggestionAbility";
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
  const ability = iDDCoordinatorSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        deanEndorsementId: Yup.string().required(),
        activeIDDCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "IDDCoordinatorSuggestion"
      );

      const { deanEndorsementId, activeIDDCoordinatorId } = validator.cast(
        req.body
      );

      const activeIDDCoordinator =
        await prisma.activeIDDCoordinator.findFirstOrThrow({
          where: {
            id: {
              equals: activeIDDCoordinatorId,
            },
          },
        });

      const iDDCoordinatorSuggestion =
        await prisma.iDDCoordinatorSuggestion.create({
          data: {
            DeanEndorsement: {
              connect: {
                id: deanEndorsementId,
              },
            },
            IDDCoordinator: {
              connect: {
                id: activeIDDCoordinator.iDDCoordinatorId,
              },
            },
          },
        });

      return res.json(iDDCoordinatorSuggestion);
    } catch (error: any) {
      console.error(error);
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

      const iDDCoordinatorSuggestions =
        await prisma.iDDCoordinatorSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).IDDCoordinatorSuggestion],
          },
        });
      const count = await prisma.iDDCoordinatorSuggestion.count({
        where: {
          AND: [accessibleBy(ability).IDDCoordinatorSuggestion],
        },
      });

      return res.json({ iDDCoordinatorSuggestions, count });
    } catch (error: any) {
      console.error(error);
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
