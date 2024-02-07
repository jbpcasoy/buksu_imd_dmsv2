import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });

      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const submittedReturnedIMERCCITLRevision =
        await prisma.submittedReturnedIMERCCITLRevision.findFirstOrThrow({
          where: {
            AND: [
              {
                id: {
                  equals: id,
                },
              },
            ],
          },
        });

      return res.json(submittedReturnedIMERCCITLRevision);
    } catch (error: any) {
      logger.error(error);
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

      const { id } = validator.cast(req.query);

      if (!user.isAdmin) {
        return res.status(403).json({
          error: {
            message: "You are not allowed to perform this action",
          },
        });
      }

      const iMERCIDDCoordinatorEndorsement =
        await prisma.iMERCIDDCoordinatorEndorsement.findFirst({
          where: {
            IMERCCITLRevision: {
              AND: [
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          IMERCCITLRevision: {
                            IMERCIDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          IMERCCITLRevision: {
                            ReturnedIMERCCITLRevision: {
                              SubmittedReturnedIMERCCITLRevision: {
                                id: {
                                  equals: id,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        });

      if (iMERCIDDCoordinatorEndorsement) {
        throw new Error("IM is already endorsed by the IDD coordinator");
      }

      const submittedReturnedIMERCCITLRevision =
        await prisma.submittedReturnedIMERCCITLRevision.delete({
          where: {
            id,
          },
        });

      return res.json(submittedReturnedIMERCCITLRevision);
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
