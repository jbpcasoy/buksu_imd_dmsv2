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
        name: Yup.string().required(),
        collegeId: Yup.string().required(),
      });
      await validator.validate(req.body);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: { message: "You are not allowed to create a department" },
        });
      }

      const { name, collegeId } = validator.cast(req.body);

      const existingDepartment = await prisma.department.findFirst({
        where: {
          name: {
            equals: name,
          },
        },
      });
      if (existingDepartment) {
        return res.status(409).json({
          error: {
            message: "Department name is already used",
          },
        });
      }

      const college = await prisma.college.findFirstOrThrow({
        where: {
          id: {
            equals: collegeId,
          },
        },
      });
      const department = await prisma.department.create({
        data: {
          name,
          College: {
            connect: {
              id: college.id,
            },
          },
        },
      });

      return res.json(department);
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
        "filter[collegeId]": Yup.string().optional(),
        "filter[collegeName]": Yup.string().optional(),
        "sort[field]": Yup.string().optional(),
        "sort[direction]": Yup.string().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
        "filter[collegeId]": filterCollegeId,
        "filter[collegeName]": filterCollegeName,
        "sort[field]": sortField,
        "sort[direction]": sortDirection,
      } = validator.cast(req.query);

      const departments = await prisma.department.findMany({
        skip,
        take,
        where: {
          AND: [
            {
              name: {
                contains: filterName,
                mode: "insensitive",
              },
            },
            {
              College: {
                id: {
                  contains: filterCollegeId,
                },
              },
            },
            {
              College: {
                name: {
                  contains: filterCollegeName,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        orderBy:
          sortField === "name"
            ? ({
                name: sortDirection ?? "asc",
              } as Prisma.DepartmentOrderByWithRelationInput)
            : sortField === "collegeName"
            ? ({
                College: {
                  name: sortDirection ?? "asc",
                },
              } as Prisma.DepartmentOrderByWithRelationInput)
            : ({
                name: sortDirection ?? "asc",
              } as Prisma.DepartmentOrderByWithRelationInput),
      });
      const count = await prisma.department.count({
        where: {
          AND: [
            {
              name: {
                contains: filterName,
                mode: "insensitive",
              },
            },
            {
              College: {
                id: {
                  contains: filterCollegeId,
                },
              },
            },
            {
              College: {
                name: {
                  contains: filterCollegeName,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      });

      return res.json({ departments, count });
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
