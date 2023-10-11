import prisma from "@/prisma/client";
import activeFacultyAbility from "@/services/ability/activeFacultyAbility";
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

  let ability = activeFacultyAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const activeFaculty = await prisma.activeFaculty.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).ActiveFaculty,
            {
              id: {
                equals: id,
              },
            },
          ],
        },
      });

      return res.json(activeFaculty);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      ForbiddenError.from(ability).throwUnlessCan("delete", "ActiveFaculty");

      const { id } = validator.cast(req.query);

      const activeCoordinator = await prisma.activeCoordinator.findFirst({
        where: {
          Coordinator: {
            Faculty: {
              ActiveFaculty: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      });
      if (activeCoordinator) {
        return res
          .status(400)
          .json({ error: { message: "Faculty is an Active Coordinator" } });
      }

      const activeChairperson = await prisma.activeChairperson.findFirst({
        where: {
          Chairperson: {
            Faculty: {
              ActiveFaculty: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      });
      if (activeChairperson) {
        return res
          .status(400)
          .json({ error: { message: "Faculty is an Active Chairperson" } });
      }

      const activeDean = await prisma.activeDean.findFirst({
        where: {
          Dean: {
            Faculty: {
              ActiveFaculty: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      });
      if (activeDean) {
        return res
          .status(400)
          .json({ error: { message: "Faculty is an Active Dean" } });
      }

      const activeFaculty = await prisma.activeFaculty.delete({
        where: {
          id,
        },
      });

      return res.json(activeFaculty);
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
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
