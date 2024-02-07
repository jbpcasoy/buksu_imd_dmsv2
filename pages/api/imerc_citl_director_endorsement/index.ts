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
        iMERCIDDCoordinatorEndorsementId: Yup.string().required(),
        activeCITLDirectorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      const { iMERCIDDCoordinatorEndorsementId, activeCITLDirectorId } =
        validator.cast(req.body);

      if (!user.isAdmin) {
        const cITLDirector = await prisma.cITLDirector.findFirst({
          where: {
            ActiveCITLDirector: {
              id: {
                equals: activeCITLDirectorId,
              },
            },
          },
        });
        if (!cITLDirector) {
          return res.status(403).json({
            error: {
              message: "Only an active CITL director can perform this action",
            },
          });
        }

        if (cITLDirector.userId !== user.id) {
          return res.status(403).json({
            error: {
              message:
                "You are not allowed to create a CITL director endorsement for this user",
            },
          });
        }
      }

      const cITLDirector = await prisma.cITLDirector.findFirstOrThrow({
        where: {
          ActiveCITLDirector: {
            id: {
              equals: activeCITLDirectorId,
            },
          },
        },
      });

      const iMERCCITLDirectorEndorsement =
        await prisma.iMERCCITLDirectorEndorsement.create({
          data: {
            CITLDirector: {
              connect: {
                id: cITLDirector.id,
              },
            },
            IMERCIDDCoordinatorEndorsement: {
              connect: {
                id: iMERCIDDCoordinatorEndorsementId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "IMERC_CITL_DIRECTOR_ENDORSEMENT_CREATED",
              },
            },
          },
        });

      const iM = await prisma.iM.findFirst({
        where: {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                IMERCIDDCoordinatorEndorsement: {
                  IMERCCITLDirectorEndorsement: {
                    id: {
                      equals: iMERCCITLDirectorEndorsement.id,
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
            subject: "IM Endorsed to IPTTU",
            text: `We are pleased to inform you that your IM titled "${iM?.title}" has been endorsed by the CITL to IPPTU for copyright application process.`,
            to: iMOwner.email,
          },
          (err) => {
            logger.error(err);
          }
        );
      }

      return res.json(iMERCCITLDirectorEndorsement);
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
      });

      await validator.validate(req.query);

      const { skip, take } = validator.cast(req.query);
      const iMERCCITLDirectorEndorsements =
        await prisma.iMERCCITLDirectorEndorsement.findMany({
          skip,
          take,
          where: {},
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.iMERCCITLDirectorEndorsement.count({
        where: {},
      });

      return res.json({ iMERCCITLDirectorEndorsements, count });
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
