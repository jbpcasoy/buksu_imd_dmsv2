import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Faculty, IM, User } from "@prisma/client";
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
  const ability = iMAbility({ user });

  const getHandler = async () => {
    try {
      const { id } = req.query;

      const iM = await prisma.iM.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).IM,
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      return res.json(iM);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const { id } = req.query;

      let iMToDelete: IM | null;
      iMToDelete = await prisma.iM.findFirstOrThrow({
        where: {
          id: {
            equals: id as string,
          },
        },
        include: {
          Faculty: {
            include: {
              ActiveFaculty: {
                include: {
                  Faculty: {
                    include: {
                      User: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        subject("IM", iMToDelete)
      );

      const iM = await prisma.iM.delete({
        where: {
          id: id as string,
        },
      });
      return res.json(iM);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const putHandler = async () => {
    try {
      const validator = Yup.object({
        title: Yup.string().required(),
        type: Yup.string()
          .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
          .required(),
      });
      await validator.validate(req.body);

      const { title, type } = validator.cast(req.body);

      const { id } = req.query;
      let iMToUpdate: IM | null;
      iMToUpdate = await prisma.iM.findFirstOrThrow({
        where: {
          id: {
            equals: id as string,
          },
        },
        include: {
          Faculty: {
            include: {
              ActiveFaculty: {
                include: {
                  Faculty: {
                    include: {
                      User: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      console.log(JSON.stringify(iMToUpdate, null, 4));

      ForbiddenError.from(ability).throwUnlessCan(
        "delete",
        subject("IM", iMToUpdate)
      );

      const iM = await prisma.iM.update({
        where: {
          id: id as string,
        },
        data: {
          title,
          type,
        },
      });

      return res.json(iM);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "DELETE":
      return await deleteHandler();
    case "GET":
      return await getHandler();
    case "PUT":
      return await putHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
