import prisma from "@/prisma/client";
import chairpersonAbility from "@/services/ability/chairpersonAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";

import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Prisma, PrismaClient, User } from "@prisma/client";
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

  let ability = chairpersonAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        activeFacultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan("create", "Chairperson");

      const { activeFacultyId } = validator.cast(req.body);

      const existingChairperson = await prisma.chairperson.findFirst({
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
      if (existingChairperson) {
        throw new Error("Chairperson already exists");
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

      const chairperson = await prisma.chairperson.create({
        data: {
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
        },
      });

      return res.json(chairperson);
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
      const chairpersons = await prisma.chairperson.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).Chairperson,
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
      const count = await prisma.chairperson.count({
        where: {
          AND: [
            accessibleBy(ability).Chairperson,
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

      return res.json({ chairpersons, count });
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
