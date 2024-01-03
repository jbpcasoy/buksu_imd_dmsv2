import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";

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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        activeFacultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: {
            message: "You are not allowed to set an active coordinator",
          },
        });
      }

      const { activeFacultyId } = validator.cast(req.body);

      const coordinator = await prisma.coordinator.findFirstOrThrow({
        where: {
          Faculty: {
            ActiveFaculty: {
              id: {
                equals: activeFacultyId,
              },
            },
          },
        },
      });

      const userActiveCoordinatorCount = await prisma.activeCoordinator.count({
        where: {
          Coordinator: {
            Faculty: {
              id: {
                equals: coordinator.facultyId,
              },
            },
          },
        },
      });

      if (userActiveCoordinatorCount > 0) {
        return res.status(409).json({
          error: {
            message:
              "Faculty can only be an active coordinator on one department",
          },
        });
      }

      const department = await prisma.department.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              Coordinator: {
                id: {
                  equals: coordinator.id,
                },
              },
            },
          },
        },
      });

      const departmentActiveCoordinatorCount =
        await prisma.activeCoordinator.count({
          where: {
            Coordinator: {
              Faculty: {
                Department: {
                  id: {
                    equals: department.id,
                  },
                },
              },
            },
          },
        });

      if (departmentActiveCoordinatorCount > 0) {
        return res.status(409).json({
          error: { message: "Department can only have one active coordinator" },
        });
      }

      const activeCoordinator = await prisma.activeCoordinator.create({
        data: {
          Coordinator: {
            connect: {
              id: coordinator.id,
            },
          },
        },
      });

      return res.json(activeCoordinator);
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
      const activeCoordinators = await prisma.activeCoordinator.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              Coordinator: {
                Faculty: {
                  User: {
                    name: {
                      contains: filterName,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const count = await prisma.activeCoordinator.count({
        where: {
          AND: [
            {
              Coordinator: {
                Faculty: {
                  User: {
                    name: {
                      contains: filterName,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
      });

      return res.json({ activeCoordinators, count });
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
