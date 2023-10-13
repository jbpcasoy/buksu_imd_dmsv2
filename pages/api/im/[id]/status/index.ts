import prisma from "@/prisma/client";
import { AppAbility } from "@/services/ability/abilityBuilder";
import iMAbility from "@/services/ability/iMAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Faculty, IM, User } from "@prisma/client";
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

  const getHandler = async () => {
    try {
      const { id } = req.query;

      const iM = await prisma.iM.findFirstOrThrow({
        where: {
          AND: [
            {
              id: {
                equals: id as string,
              },
            },
          ],
        },
      });

      const departmentReview = await prisma.departmentReview.findFirst({
        where: {
          IMFile: {
            IM: {
              id: {
                equals: iM.id,
              },
            },
          },
        },
      });

      const submittedPeerSuggestion =
        await prisma.submittedPeerSuggestion.findFirst({
          where: {
            PeerSuggestion: {
              PeerReview: {
                DepartmentReview: {
                  id: {
                    equals: departmentReview?.id,
                  },
                },
              },
            },
          },
        });

      const submittedCoordinatorSuggestion =
        await prisma.submittedCoordinatorSuggestion.findFirst({
          where: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  id: {
                    equals: departmentReview?.id,
                  },
                },
              },
            },
          },
        });

      const submittedChairpersonSuggestion =
        await prisma.submittedChairpersonSuggestion.findFirst({
          where: {
            ChairpersonSuggestion: {
              ChairpersonReview: {
                DepartmentReview: {
                  id: {
                    equals: departmentReview?.id,
                  },
                },
              },
            },
          },
        });

      /**
       * Status list:
       * IMPLEMENTATION_DRAFT - IM is created but not yet submitted for review.
       * IMPLEMENTATION_DEPARTMENT_REVIEW - IM is submitted for department review
       * IMPLEMENTATION_DEPARTMENT_REVIEWED - IM is submitted for department review and has been reviewed by peer, coordinator, and suggestion
       */

      console.log({
        iM,
        departmentReview,
        submittedChairpersonSuggestion,
        submittedCoordinatorSuggestion,
        submittedPeerSuggestion,
      });

      if (
        departmentReview &&
        submittedPeerSuggestion &&
        submittedCoordinatorSuggestion &&
        submittedChairpersonSuggestion
      ) {
        return res.send("IMPLEMENTATION_DEPARTMENT_REVIEWED");
      } else if (departmentReview) {
        return res.send("IMPLEMENTATION_DEPARTMENT_REVIEW");
      } else {
        return res.send("IMPLEMENTATION_DRAFT");
      }
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
