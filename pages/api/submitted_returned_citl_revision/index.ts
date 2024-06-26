import prisma from "@/prisma/client";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import mailTransporter from "@/services/mailTransporter";
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

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedCITLRevisionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { returnedCITLRevisionId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const iDDCoordinator = await prisma.iDDCoordinator.findFirst({
          where: {
            ActiveIDDCoordinator: {
              IDDCoordinator: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        });

        if (!iDDCoordinator) {
          return res.status(403).json({
            error: {
              message: "Only an active IDD coordinator can perform this action",
            },
          });
        }

        const returnedCITLRevision =
          await prisma.returnedCITLRevision.findFirstOrThrow({
            where: {
              id: {
                equals: returnedCITLRevisionId,
              },
            },
          });
        if (iDDCoordinator.id !== returnedCITLRevision.iDDCoordinatorId) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to submit this returned CITL revision",
            },
          });
        }
      }
      const returnedCITLRevisionSuggestionItemCount =
        await prisma.returnedCITLRevisionSuggestionItem.count({
          where: {
            returnedCITLRevisionId: {
              equals: returnedCITLRevisionId,
            },
          },
        });
      if (returnedCITLRevisionSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
      }

      const iDDCoordinatorEndorsement =
        await prisma.iDDCoordinatorEndorsement.findFirst({
          where: {
            CITLRevision: {
              AND: [
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          CITLRevision: {
                            ReturnedCITLRevision: {
                              id: {
                                equals: returnedCITLRevisionId,
                              },
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
                          CITLRevision: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
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

      if (iDDCoordinatorEndorsement) {
        throw new Error("IM is already endorsed by the IDD coordinator");
      }

      const submittedReturnedCITLRevision =
        await prisma.submittedReturnedCITLRevision.create({
          data: {
            ReturnedCITLRevision: {
              connect: {
                id: returnedCITLRevisionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_RETURNED_CITL_REVISION_CREATED",
              },
            },
          },
        });

      const iM = await prisma.iM.findFirst({
        where: {
          IMFile: {
            some: {
              CITLRevision: {
                ReturnedCITLRevision: {
                  id: {
                    equals: returnedCITLRevisionId,
                  },
                },
              },
            },
          },
        },
      });
      const iMOwner = await prisma.user.findFirst({
        where: {
          Faculty: {
            some: {
              IM: {
                some: {
                  id: {
                    equals: iM?.id,
                  },
                },
              },
            },
          },
        },
      });

      if (iMOwner?.email) {
        mailTransporter.sendMail(
          {
            subject: "Returned IM CITL Revision",
            text: `Unfortunately the revision for your IM titled "${iM?.title}" has been returned and is now ready for your revision.`,
            to: iMOwner.email,
          },
          (err) => {
            logger.error(err);
          }
        );
      }

      return res.json(submittedReturnedCITLRevision);
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
      const submittedReturnedCITLRevisions =
        await prisma.submittedReturnedCITLRevision.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedReturnedCITLRevision.count({
        where: {},
      });

      return res.json({ submittedReturnedCITLRevisions, count });
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
