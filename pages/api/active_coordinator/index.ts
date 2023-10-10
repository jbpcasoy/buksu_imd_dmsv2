import prisma from "@/prisma/client";
import activeCoordinatorAbility from "@/services/ability/activeCoordinatorAbility";
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

  let ability = activeCoordinatorAbility({ user });

  const postHandler = async () => {
    const validator = Yup.object({
      activeFacultyId: Yup.string().required(),
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
        "ActiveCoordinator"
      );
    } catch (error) {
      console.error(error);
      return res.status(403).json({ error });
    }

    const { activeFacultyId } = validator.cast(req.body);
    try {
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
          error: { message: "User can only have one active coordinator" },
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
    try {
      const activeCoordinators = await prisma.activeCoordinator.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveCoordinator,
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
      const count = await prisma.activeCoordinator.count({
        where: {
          AND: [accessibleBy(ability).ActiveCoordinator],
        },
      });

      return res.json({ activeCoordinators, count });
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