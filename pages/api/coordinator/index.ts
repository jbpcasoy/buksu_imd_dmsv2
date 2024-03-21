import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { Prisma, User } from "@prisma/client";
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
          error: { message: "You are not allowed to create a coordinator" },
        });
      }

      const { activeFacultyId } = validator.cast(req.body);

      const existingCoordinator = await prisma.coordinator.findFirst({
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
      if (existingCoordinator) {
        return res
          .status(409)
          .json({ error: { message: "Coordinator already exists" } });
      }
      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          ActiveFaculty: {
            id: {
              equals: activeFacultyId,
            },
          },
        },
      });

      const coordinator = await prisma.coordinator.create({
        data: {
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
        },
      });

      return res.json(coordinator);
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
        "filter[departmentName]": Yup.string().optional(),
        "filter[collegeName]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
        "filter[departmentName]": filterDepartmentName,
        "filter[collegeName]": filterCollegeName,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);
      const coordinators = await prisma.coordinator.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              Faculty: {
                User: {
                  name: {
                    contains: filterName,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  name: {
                    contains: filterDepartmentName,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  College: {
                    name: {
                      contains: filterCollegeName,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
        orderBy:
          sortField === "name"
            ? ({
                Faculty: {
                  User: {
                    name: sortDirection ?? "asc",
                  },
                },
              } as Prisma.FacultyOrderByWithRelationInput)
            : sortField === "departmentName"
            ? ({
                Faculty: {
                  Department: {
                    name: sortDirection ?? "asc",
                  },
                },
              } as Prisma.FacultyOrderByWithRelationInput)
            : sortField === "collegeName"
            ? ({
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection ?? "asc",
                    },
                  },
                },
              } as Prisma.FacultyOrderByWithRelationInput)
            : ({
                updatedAt: "desc",
              } as Prisma.FacultyOrderByWithRelationInput),
      });
      const count = await prisma.coordinator.count({
        where: {
          AND: [
            {
              Faculty: {
                User: {
                  name: {
                    contains: filterName,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  name: {
                    contains: filterDepartmentName,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              Faculty: {
                Department: {
                  College: {
                    name: {
                      contains: filterCollegeName,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
      });

      return res.json({ coordinators, count });
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
