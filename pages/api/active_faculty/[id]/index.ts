import prisma from "@/prisma/client";
import { readActiveFaculty } from "@/services/activeFacultyService";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";

import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const getHandler = async () => {
    try {
      const id = req.query.id as string;

      const activeFaculty = await readActiveFaculty({ id });

      return res.json(activeFaculty);
    } catch (error: any) {
      logger.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  const deleteHandler = async () => {
    try {
      const id = req.query.id as string;

      if (!user.isAdmin) {
        return res.status(403).json({
          error: {
            message: "You are not allowed to remove this active faculty",
          },
        });
      }

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
        return res.status(400).json({
          error: {
            message: "Cannot deactivate, please remove coordinator role first",
          },
        });
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
        return res.status(400).json({
          error: {
            message: "Cannot deactivate, please remove chairperson role first",
          },
        });
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
        return res.status(400).json({
          error: {
            message: "Cannot deactivate, please remove dean role first",
          },
        });
      }

      const activeContentSpecialist =
        await prisma.activeContentSpecialist.findFirst({
          where: {
            ContentSpecialist: {
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
      if (activeContentSpecialist) {
        return res.status(400).json({
          error: {
            message:
              "Cannot deactivate, please remove content specialist role first",
          },
        });
      }

      const activeFaculty = await prisma.activeFaculty.delete({
        where: {
          id,
        },
      });

      return res.json(activeFaculty);
    } catch (error: any) {
      logger.error(error);
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
