import prisma from "@/prisma/client";
import facultyAbility from "@/services/ability/facultyAbility";
import iMAbility from "@/services/ability/iMAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { ActiveFaculty, Faculty, User } from "@prisma/client";
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
        title: Yup.string().required(),
        activeFacultyId: Yup.string().required(),
        type: Yup.string()
          .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
          .required(),
      });
      await validator.validate(req.body);

      const { activeFacultyId, title, type } = validator.cast(req.body);

      let faculty: Faculty;
      faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          ActiveFaculty: {
            id: {
              equals: activeFacultyId,
            },
          },
        },
      });

      const ability = facultyAbility({ user });

      ForbiddenError.from(ability).throwUnlessCan(
        "connectToIM",
        subject("Faculty", faculty)
      );

      const iM = await prisma.iM.create({
        data: {
          title,
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
          type,
          Event: {
            create: {
              User: {
                connect: {
                  id: user.id,
                },
              },
              type: "IM_CREATED",
            },
          },
        },
      });

      return res.json(iM);
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
        "filter[title]": Yup.string().optional(),
        "filter[userName]": Yup.string().optional(),
        "filter[collegeName]": Yup.string().optional(),
        "filter[departmentName]": Yup.string().optional(),
      });
      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[collegeName]": filterCollegeName,
        "filter[departmentName]": filterDepartmentName,
        "filter[title]": filterTitle,
        "filter[userName]": filterUserName,
      } = validator.cast(req.query);

      const ability = iMAbility({ user });

      const iMs = await prisma.iM.findMany({
        skip,
        take,
        where: {
          AND: [
            accessibleBy(ability).IM,
            {
              Faculty: {
                User: {
                  name: {
                    contains: filterUserName ?? "",
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              title: {
                contains: filterTitle ?? "",
                mode: "insensitive",
              },
            },
            {
              Faculty: {
                Department: {
                  name: {
                    contains: filterDepartmentName ?? "",
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
                      contains: filterCollegeName ?? "",
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
      const count = await prisma.iM.count({
        where: {
          AND: [
            accessibleBy(ability).IM,

            {
              Faculty: {
                User: {
                  name: {
                    contains: filterUserName ?? "",
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              title: {
                contains: filterTitle ?? "",
                mode: "insensitive",
              },
            },
            {
              Faculty: {
                Department: {
                  name: {
                    contains: filterDepartmentName ?? "",
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
                      contains: filterCollegeName ?? "",
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
      });
      return res.json({ iMs, count });
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
