import prisma from "@/prisma/client";
import { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import * as Yup from "yup";
import { authOptions } from "../auth/[...nextauth]";
import getServerUser from "@/services/getServerUser";
import iMAbility from "@/services/ability/iMAbility";
import { accessibleBy } from "@casl/prisma";
import { ForbiddenError, subject } from "@casl/ability";
import { AppAbility } from "@/services/ability/abilityBuilder";
import facultyAbility from "@/services/ability/facultyAbility";

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

  let ability: AppAbility;

  try {
    const faculty = await prisma.faculty.findFirstOrThrow({
      where: {
        ActiveFaculty: {
          Faculty: {
            userId: {
              equals: user.id,
            },
          },
        },
      },
    });
    ability = iMAbility(user, faculty);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error });
  }

  const postHandler = async () => {
    const validator = Yup.object({
      title: Yup.string().required(),
      activeFacultyId: Yup.string().required(),
      type: Yup.string()
        .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
        .required(),
    });
    try {
      await validator.validate(req.body);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const { activeFacultyId, title, type } = validator.cast(req.body);
    // TODO test on admins case
    /**
     * Possible scenarios:
     * returns status 400 because active faculty is not found
     * 
     * 
     * Notes:
     * validation if faculty is active must be in abilities
     */
    // TODO create mocha test for all abilities
    /**
     * scenarios:
     * admin access with only user data and no other else
     * user with invalid access (as many as necessary)
     * user with valid access (as many as necessary)
     * 
     * Danger zones:
     * parts with "findFirstOrThrow"
     * 
     * Libraries to use:
     * Mocha
     * Chai
     * faker
     */
    try {
      const activeFaculty = await prisma.activeFaculty.findFirstOrThrow({
        where: {
          id: {
            equals: activeFacultyId,
          },
        },
      });

      const faculty = await prisma.faculty.findFirstOrThrow({
        where: {
          id: {
            equals: activeFaculty.facultyId,
          },
        },
      });

      try {
        ForbiddenError.from(ability).throwUnlessCan(
          "createIM",
          subject("Faculty", faculty)
        );
      } catch (error) {
        console.error(error);
        return res.status(403).json({ error });
      }

      const iM = await prisma.iM.create({
        data: {
          title,
          Faculty: {
            connect: {
              id: faculty.id,
            },
          },
          type,
        },
      });

      return res.json(iM);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  };

  const getHandler = async () => {
    const validator = Yup.object({
      take: Yup.number().required(),
      skip: Yup.number().required(),
    });

    try {
      await validator.validate(req.query);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }

    const { skip, take } = validator.cast(req.query);
    try {
      const iM = await prisma.iM.findMany({
        skip,
        take,
        where: { AND: [accessibleBy(ability).IM] },
      });
      const count = await prisma.iM.count({
        where: { AND: [accessibleBy(ability).IM] },
      });

      return res.json({ iM, count });
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
