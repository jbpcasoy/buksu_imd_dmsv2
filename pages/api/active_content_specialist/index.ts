import prisma from "@/prisma/client";
import activeContentSpecialistAbility from "@/services/ability/activeContentSpecialistAbility";
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

  let ability = activeContentSpecialistAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        activeFacultyId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "ActiveContentSpecialist"
      );

      const { activeFacultyId } = validator.cast(req.body);
      const contentSpecialist = await prisma.contentSpecialist.findFirstOrThrow({
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

      const userActiveContentSpecialistCount = await prisma.activeContentSpecialist.count({
        where: {
          ContentSpecialist: {
            Faculty: {
              id: {
                equals: contentSpecialist.facultyId,
              },
            },
          },
        },
      });

      if (userActiveContentSpecialistCount > 0) {
        return res.status(409).json({
          error: { message: "User can only have one active contentSpecialist" },
        });
      }

      const department = await prisma.department.findFirstOrThrow({
        where: {
          Faculty: {
            some: {
              ContentSpecialist: {
                id: {
                  equals: contentSpecialist.id,
                },
              },
            },
          },
        },
      });

      const departmentActiveContentSpecialistCount =
        await prisma.activeContentSpecialist.count({
          where: {
            ContentSpecialist: {
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

      if (departmentActiveContentSpecialistCount > 0) {
        return res.status(409).json({
          error: { message: "Department can only have one active contentSpecialist" },
        });
      }

      const activeContentSpecialist = await prisma.activeContentSpecialist.create({
        data: {
          ContentSpecialist: {
            connect: {
              id: contentSpecialist.id,
            },
          },
        },
      });

      return res.json(activeContentSpecialist);
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
      const activeContentSpecialists = await prisma.activeContentSpecialist.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).ActiveContentSpecialist,
            {
              ContentSpecialist: {
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
      const count = await prisma.activeContentSpecialist.count({
        where: {
          AND: [accessibleBy(ability).ActiveContentSpecialist],
        },
      });

      return res.json({ activeContentSpecialists, count });
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
