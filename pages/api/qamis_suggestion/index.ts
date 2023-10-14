import prisma from "@/prisma/client";
import qAMISSuggestionAbility from "@/services/ability/qAMISSuggestionAbility";
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
  const ability = qAMISSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        cITLDirectorEndorsementId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "QAMISSuggestion");

      const { cITLDirectorEndorsementId } = validator.cast(req.body);

      const qAMISSuggestion = await prisma.qAMISSuggestion.create({
        data: {
          CITLDirectorEndorsement: {
            connect: {
              id: cITLDirectorEndorsementId,
            },
          },
        },
      });

      return res.json(qAMISSuggestion);
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
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);

      const qAMISSuggestions = await prisma.qAMISSuggestion.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).QAMISSuggestion],
        },
      });
      const count = await prisma.qAMISSuggestion.count({
        where: {
          AND: [accessibleBy(ability).QAMISSuggestion],
        },
      });

      return res.json({ qAMISSuggestions, count });
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
