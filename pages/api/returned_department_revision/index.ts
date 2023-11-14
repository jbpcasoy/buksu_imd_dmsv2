import prisma from "@/prisma/client";
import returnedDepartmentRevisionAbility from "@/services/ability/returnedDepartmentRevisionAbility";
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
  const ability = returnedDepartmentRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        departmentRevisionId: Yup.string().required(),
        activeCoordinatorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ReturnedDepartmentRevision"
      );

      const { activeCoordinatorId, departmentRevisionId } = validator.cast(
        req.body
      );

      const coordinatorEndorsement =
        await prisma.coordinatorEndorsement.findFirst({
          where: {
            DepartmentRevision: {
              AND: [
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          DepartmentRevision: {
                            id: {
                              equals: departmentRevisionId,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          DepartmentRevision: {
                            CoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        });

      if (coordinatorEndorsement) {
        throw new Error("IM already endorsed by IDD Coordinator");
      }

      const activeCoordinator = await prisma.activeCoordinator.findFirstOrThrow(
        {
          where: {
            id: {
              equals: activeCoordinatorId,
            },
          },
        }
      );

      const returnedDepartmentRevision =
        await prisma.returnedDepartmentRevision.create({
          data: {
            DepartmentRevision: {
              connect: {
                id: departmentRevisionId,
              },
            },
            Coordinator: {
              connect: {
                id: activeCoordinator.coordinatorId,
              },
            },
          },
        });

      return res.json(returnedDepartmentRevision);
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

      const returnedDepartmentRevisions =
        await prisma.returnedDepartmentRevision.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).ReturnedDepartmentRevision],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.returnedDepartmentRevision.count({
        where: {
          AND: [accessibleBy(ability).ReturnedDepartmentRevision],
        },
      });

      return res.json({ returnedDepartmentRevisions, count });
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
