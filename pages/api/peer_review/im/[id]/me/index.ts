import prisma from "@/prisma/client";
import peerReviewAbility from "@/services/ability/peerReviewAbility";
import getServerUser from "@/services/getServerUser";
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
  const ability = peerReviewAbility({ user });

  const getHandler = async () => {
    try {
      const validator = Yup.object({
        id: Yup.string().required(),
      });
      await validator.validate(req.query);

      const { id } = validator.cast(req.query);
      const peerReview = await prisma.peerReview.findFirstOrThrow({
        where: {
          AND: [
            accessibleBy(ability).PeerReview,
            {
              DepartmentReview: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
            {
              DepartmentReview: {
                PeerReview: {
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
          ],
        },
      });

      return res.json(peerReview);
    } catch (error: any) {
      console.error(error);
      return res
        .status(400)
        .json({ error: { message: error?.message ?? "Server Error" } });
    }
  };

  switch (req.method) {
    case "GET":
      return await getHandler();
    default:
      return res.status(405).send(`${req.method} Not Allowed`);
  }
}
