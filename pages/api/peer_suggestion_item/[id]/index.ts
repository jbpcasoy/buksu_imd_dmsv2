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

  const getHandler = async () => {
    const validator = Yup.object({
      id: Yup.string().required(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const peerSuggestionItem =
        await prisma.peerSuggestionItem.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).PeerSuggestionItem,
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(peerSuggestionItem);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const deleteHandler = async () => {
    const validator = Yup.object({
      id: Yup.string().required(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "PeerSuggestionItem"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { id } = validator.cast(req.query);
    try {
      const peerSuggestionItem = await prisma.peerSuggestionItem.delete({
        where: {
          id,
        },
      });

      return res.json(peerSuggestionItem);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const putHandler = async () => {
    const bodyValidator = Yup.object({
      actionTaken: Yup.string().required(),
      remarks: Yup.string().optional(),
      suggestion: Yup.string().optional(),
    });

    try {
      await bodyValidator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "PeerSuggestionItem"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }
    const { id } = req.query;
    const { actionTaken, remarks, suggestion } = bodyValidator.cast(req.body);

    try {
      const peerSuggestionItem = await prisma.peerSuggestionItem.update({
        where: {
          id: id as string,
        },
        data: {
          actionTaken,
          remarks,
          suggestion,
        },
      });

      return res.json(peerSuggestionItem);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
