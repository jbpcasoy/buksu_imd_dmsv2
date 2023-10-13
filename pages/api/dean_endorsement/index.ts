import prisma from "@/prisma/client";
import deanEndorsementAbility from "@/services/ability/deanEndorsementAbility";
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
  const ability = deanEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        coordinatorEndorsementId: Yup.string().required(),
        activeDeanId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "DeanEndorsement"
      );

      const {  coordinatorEndorsementId, activeDeanId } = validator.cast(
        req.body
      );

      const dean = await prisma.dean.findFirstOrThrow({
        where: {
          ActiveDean: {
            id: {
              equals: activeDeanId,
            },
          },
        },
      });

      const deanEndorsement = await prisma.deanEndorsement.create(
        {
          data: {
            Dean: {
              connect: {
                id: dean.id,
              },
            },
            CoordinatorEndorsement: {
              connect: {
                id: coordinatorEndorsementId,
              },
            },
          },
        }
      );

      return res.json(deanEndorsement);
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
      const deanEndorsements =
        await prisma.deanEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).DeanEndorsement],
          },
        });
      const count = await prisma.deanEndorsement.count({
        where: {
          AND: [accessibleBy(ability).DeanEndorsement],
        },
      });

      return res.json({ deanEndorsements, count });
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
