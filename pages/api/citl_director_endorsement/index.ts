import prisma from "@/prisma/client";
import cITLDirectorEndorsementAbility from "@/services/ability/cITLDirectorEndorsementAbility";
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
  const ability = cITLDirectorEndorsementAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDCoordinatorEndorsementId: Yup.string().required(),
        activeCITLDirectorId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "CITLDirectorEndorsement"
      );

      const { iDDCoordinatorEndorsementId, activeCITLDirectorId } =
        validator.cast(req.body);

      const cITLDirector = await prisma.cITLDirector.findFirstOrThrow({
        where: {
          ActiveCITLDirector: {
            id: {
              equals: activeCITLDirectorId,
            },
          },
        },
      });

      const cITLDirectorEndorsement =
        await prisma.cITLDirectorEndorsement.create({
          data: {
            CITLDirector: {
              connect: {
                id: cITLDirector.id,
              },
            },
            IDDCoordinatorEndorsement: {
              connect: {
                id: iDDCoordinatorEndorsementId,
              },
            },
            Event: {
              create: {
                User: {
                  connect: {
                    id: user.id,
                  },
                },
                type: "CITL_DIRECTOR_ENDORSEMENT_CREATED",
              },
            },
          },
        });

      const iM = await prisma.iM.findFirst({
        where: {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    id: {
                      equals: cITLDirectorEndorsement.id,
                      mode: "insensitive",
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
            subject: "CITL Director Endorsed",
            text: `We are pleased to inform you that your IM titled "${iM?.title}" has been endorsed by the CITL Director. It is now ready for a try-out, and QAMIS revision can then be accomplished.`,
            to: iMOwner.email,
          },
          (err) => {
            logger.error(err);
          }
        );
      }

      return res.json(cITLDirectorEndorsement);
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
      const cITLDirectorEndorsements =
        await prisma.cITLDirectorEndorsement.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).CITLDirectorEndorsement],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.cITLDirectorEndorsement.count({
        where: {
          AND: [accessibleBy(ability).CITLDirectorEndorsement],
        },
      });

      return res.json({ cITLDirectorEndorsements, count });
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
