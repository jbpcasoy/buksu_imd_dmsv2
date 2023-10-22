import prisma from "@/prisma/client";
import peerSuggestionAbility from "@/services/ability/peerSuggestionAbility";
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
  const ability = peerSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        peerReviewId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "PeerSuggestion");

      const { peerReviewId } = validator.cast(req.body);

      const peerSuggestion = await prisma.peerSuggestion.create({
        data: {
          PeerReview: {
            connect: {
              id: peerReviewId,
            },
          },
        },
      });

      return res.json(peerSuggestion);
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
      

      const peerSuggestions = await prisma.peerSuggestion.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).PeerSuggestion],
        },
      });
      const count = await prisma.peerSuggestion.count({
        where: {
          AND: [accessibleBy(ability).PeerSuggestion],
        },
      });

      return res.json({ peerSuggestions, count });
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
