import prisma from "@/prisma/client";
import submittedReturnedIMERCCITLRevisionAbility from "@/services/ability/submittedReturnedIMERCCITLRevisionAbility";
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
  const ability = submittedReturnedIMERCCITLRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedIMERCCITLRevisionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedReturnedIMERCCITLRevision"
      );

      const { returnedIMERCCITLRevisionId } = validator.cast(req.body);
      const returnedIMERCCITLRevisionSuggestionItemCount =
        await prisma.returnedIMERCCITLRevisionSuggestionItem.count({
          where: {
            returnedIMERCCITLRevisionId: {
              equals: returnedIMERCCITLRevisionId,
            },
          },
        });
      if (returnedIMERCCITLRevisionSuggestionItemCount < 1) {
        throw new Error("Suggestions are required upon submitting");
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
                            ReturnedIMERCCITLRevision: {
                              id: {
                                equals: returnedIMERCCITLRevisionId,
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
              ],
            },
          },
        });

      if (iMERCIDDCoordinatorEndorsement) {
        throw new Error("IM already endorsed by IDD Coordinator");
      }

      const submittedReturnedIMERCCITLRevision =
        await prisma.submittedReturnedIMERCCITLRevision.create({
          data: {
            ReturnedIMERCCITLRevision: {
              connect: {
                id: returnedIMERCCITLRevisionId as string,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "SUBMITTED_RETURNED_IMERC_CITL_REVISION_CREATED",
              },
            },
          },
        });

      const iM = await prisma.iM.findFirst({
        where: {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                ReturnedIMERCCITLRevision: {
                  SubmittedReturnedIMERCCITLRevision: {
                    id: {
                      equals: submittedReturnedIMERCCITLRevision.id,
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
            subject: "Returned IM IMERC Revision",
            text: `Unfortunately the revision for your IM titled "${iM?.title}" has been returned and is now ready for your revision.`,
            to: iMOwner.email,
          },
          (err) => {
            logger.error(err);
          }
        );
      }

      return res.json(submittedReturnedIMERCCITLRevision);
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
      const submittedReturnedIMERCCITLRevisions =
        await prisma.submittedReturnedIMERCCITLRevision.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).SubmittedReturnedIMERCCITLRevision],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedReturnedIMERCCITLRevision.count({
        where: {
          AND: [accessibleBy(ability).SubmittedReturnedIMERCCITLRevision],
        },
      });

      return res.json({ submittedReturnedIMERCCITLRevisions, count });
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
