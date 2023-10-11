import prisma from "@/prisma/client";
import peerSuggestionItemAbility from "@/services/ability/peerSuggestionItemAbility";
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
  const ability = peerSuggestionItemAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        peerSuggestionId: Yup.string().required(),
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "PeerSuggestionItem"
      );

      const { actionTaken, peerSuggestionId, remarks, suggestion } =
        validator.cast(req.body);

      const peerSuggestionItem = await prisma.peerSuggestionItem.create({
        data: {
          actionTaken,
          remarks,
          suggestion,
          PeerSuggestion: {
            connect: {
              id: peerSuggestionId,
            },
          },
        },
      });

      return res.json(peerSuggestionItem);
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
      const peerSuggestionItems = await prisma.peerSuggestionItem.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).PeerSuggestionItem],
        },
      });
      const count = await prisma.peerSuggestionItem.count({
        where: {
          AND: [accessibleBy(ability).PeerSuggestionItem],
        },
      });

      return res.json({ peerSuggestionItems, count });
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
