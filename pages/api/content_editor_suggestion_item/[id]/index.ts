import prisma from "@/prisma/client";
import contentEditorSuggestionItemAbility from "@/services/ability/contentEditorSuggestionItemAbility";
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
  const ability = contentEditorSuggestionItemAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);

      const contentEditorSuggestionItem =
        await prisma.contentEditorSuggestionItem.findFirstOrThrow({
          where: {
            AND: [
              accessibleBy(ability).ContentEditorSuggestionItem,
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(contentEditorSuggestionItem);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        "ContentEditorSuggestionItem"
      );

      const { id } = validator.cast(req.query);

      const contentEditorSuggestionItem = await prisma.contentEditorSuggestionItem.delete({
        where: {
          id,
        },
      });

      return res.json(contentEditorSuggestionItem);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        actionTaken: Yup.string().optional(),
        remarks: Yup.string().optional(),
        suggestion: Yup.string().optional(),
        pageNumber: Yup.number().min(0).optional(),
      });

      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "update",
        "ContentEditorSuggestionItem"
      );
      const { id } = req.query;
      const { actionTaken, remarks, suggestion, pageNumber } = validator.cast(
        req.body
      );

      const contentEditorSuggestionItem = await prisma.contentEditorSuggestionItem.update({
        where: {
          id: id as string,
        },
        data: {
          actionTaken,
          remarks,
          suggestion,
          pageNumber,
        },
      });

      return res.json(contentEditorSuggestionItem);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
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
