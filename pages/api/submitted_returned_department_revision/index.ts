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
        returnedDepartmentRevisionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { returnedDepartmentRevisionId } = validator.cast(req.body);

      if (!user.isAdmin) {
        const coordinator = await prisma.coordinator.findFirst({
          where: {
            ActiveCoordinator: {
              Coordinator: {
                Faculty: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        });
        if (!coordinator) {
          return res.status(403).json({
            error: {
              message:
                "Only an active coordinator is allowed to perform this action",
            },
          });
        }

        const returnedDepartmentRevision =
          await prisma.returnedDepartmentRevision.findFirstOrThrow({
            where: {
              id: {
                equals: returnedDepartmentRevisionId,
              },
            },
          });
        if (returnedDepartmentRevision.coordinatorId !== coordinator.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to submit this returned department revision suggestion",
            },
          });
        }
      }

      const returnedDepartmentRevisionSuggestionItemCount =
        await prisma.returnedDepartmentRevisionSuggestionItem.count({
          where: {
            returnedDepartmentRevisionId: {
              equals: returnedDepartmentRevisionId,
            },
          },
        });
      if (returnedDepartmentRevisionSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
      }

      const coordinatorEndorsement =
        await prisma.coordinatorEndorsement.findFirst({
          where: {
            DepartmentRevision: {
              AND: [
                {
                  IMFile: {
                    IM: {
                      IMFile: {
                        some: {
                          DepartmentRevision: {
                            ReturnedDepartmentRevision: {
                              id: {
                                equals: returnedDepartmentRevisionId,
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
                          DepartmentRevision: {
                            CoordinatorEndorsement: {
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

      if (coordinatorEndorsement) {
        throw new Error("IM is already endorsed by the coordinator");
      }

      const submittedReturnedDepartmentRevision =
        await prisma.submittedReturnedDepartmentRevision.create({
          data: {
            ReturnedDepartmentRevision: {
              connect: {
                id: returnedDepartmentRevisionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_RETURNED_DEPARTMENT_REVISION_CREATED",
              },
            },
          },
        });

      const iM = await prisma.iM.findFirst({
        where: {
          IMFile: {
            some: {
              DepartmentRevision: {
                ReturnedDepartmentRevision: {
                  SubmittedReturnedDepartmentRevision: {
                    id: {
                      equals: submittedReturnedDepartmentRevision.id,
                    },
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
            subject: "Returned IM Department Revision",
            text: `Unfortunately the revision for your IM titled "${iM?.title}" has been returned and is now ready for your revision.`,
            to: iMOwner.email,
          },
          (err) => {
            logger.error(err);
          }
        );
      }

      return res.json(submittedReturnedDepartmentRevision);
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
      const submittedReturnedDepartmentRevisions =
        await prisma.submittedReturnedDepartmentRevision.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedReturnedDepartmentRevision.count({
        where: {},
      });

      return res.json({ submittedReturnedDepartmentRevisions, count });
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
