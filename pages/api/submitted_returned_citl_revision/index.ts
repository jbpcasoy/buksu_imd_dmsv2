import prisma from "@/prisma/client";
import submittedReturnedCITLRevisionAbility from "@/services/ability/submittedReturnedCITLRevisionAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
import mailTransporter from "@/services/mailTransporter";
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
  const ability = submittedReturnedCITLRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedCITLRevisionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedReturnedCITLRevision"
      );

      const { returnedCITLRevisionId } = validator.cast(req.body);
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
        throw new Error("IM already endorsed by IDD Coordinator");
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
          where: {
            AND: [accessibleBy(ability).SubmittedReturnedCITLRevision],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedReturnedCITLRevision.count({
        where: {
          AND: [accessibleBy(ability).SubmittedReturnedCITLRevision],
        },
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
