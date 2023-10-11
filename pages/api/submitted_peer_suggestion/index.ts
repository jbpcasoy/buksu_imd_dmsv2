import prisma from "@/prisma/client";
import submittedPeerSuggestionAbility from "@/services/ability/submittedPeerReviewAbility";
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
  const ability = submittedPeerSuggestionAbility({ user });

  const postHandler = async () => {
    const validator = Yup.object({
      peerSuggestionId: Yup.string().required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedPeerSuggestion"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { peerSuggestionId } = validator.cast(req.body);
    try {
      const submittedPeerSuggestion = await prisma.submittedPeerSuggestion.create({
        data: {
          PeerSuggestion: {
            connect: {
              id: peerSuggestionId as string,
            },
          },
        },
      });

      return res.json(submittedPeerSuggestion);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const getHandler = async () => {
    const validator = Yup.object({
      take: Yup.number().required(),
      skip: Yup.number().required(),
      "filter[name]": Yup.string().optional(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const {
      skip,
      take,
      "filter[name]": filterName,
    } = validator.cast(req.query);
    console.log({ filterName });
    try {
      const submittedPeerSuggestions = await prisma.submittedPeerSuggestion.findMany({
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
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
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
