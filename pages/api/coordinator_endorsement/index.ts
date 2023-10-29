import prisma from "@/prisma/client";
import coordinatorEndorsementAbility from "@/services/ability/coordinatorEndorsementAbility";
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
  const ability = coordinatorEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        departmentRevisionId: Yup.string().required(),
        activeCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "CoordinatorEndorsement"
      );

      const { departmentRevisionId, activeCoordinatorId } = validator.cast(
        req.body
      );

      const coordinator = await prisma.coordinator.findFirstOrThrow({
        where: {
          ActiveCoordinator: {
            id: {
              equals: activeCoordinatorId,
            },
          },
        },
      });

      const coordinatorEndorsement = await prisma.coordinatorEndorsement.create(
        {
          data: {
            Coordinator: {
              connect: {
                id: coordinator.id,
              },
            },
            DepartmentRevision: {
              connect: {
                id: departmentRevisionId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "COORDINATOR_ENDORSEMENT_CREATED",
              },
            },
          },
        }
      );

      return res.json(coordinatorEndorsement);
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

      const { skip, take } = validator.cast(req.query);
      const coordinatorEndorsements =
        await prisma.coordinatorEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).CoordinatorEndorsement],
          },
        });
      const count = await prisma.coordinatorEndorsement.count({
        where: {
          AND: [accessibleBy(ability).CoordinatorEndorsement],
        },
      });

      return res.json({ coordinatorEndorsements, count });
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
