import prisma from "@/prisma/client";
import submittedIDDSpecialistSuggestionAbility from "@/services/ability/submittedIDDSpecialistSuggestionAbility";
import getServerUser from "@/services/getServerUser";
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
    console.error(error);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
  const ability = submittedIDDSpecialistSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iDDSpecialistSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedIDDSpecialistSuggestion"
      );
      const { iDDSpecialistSuggestionId } = validator.cast(req.body);
      const submittedIDDSpecialistSuggestion =
        await prisma.submittedIDDSpecialistSuggestion.create({
          data: {
            IDDSpecialistSuggestion: {
              connect: {
                id: iDDSpecialistSuggestionId as string,
              },
            },
          },
        });
    //   const submittedCoordinatorSuggestion =
    //     await prisma.submittedCoordinatorSuggestion.findFirst({
    //       where: {
    //         CoordinatorSuggestion: {
    //           CoordinatorReview: {
    //             DepartmentReview: {
    //               PeerReview: {
    //                 IDDSpecialistSuggestion: {
    //                   SubmittedIDDSpecialistSuggestion: {
    //                     id: {
    //                       equals: submittedIDDSpecialistSuggestion.id,
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     });

    //   const submittedChairpersonSuggestion =
    //     await prisma.submittedChairpersonSuggestion.findFirst({
    //       where: {
    //         ChairpersonSuggestion: {
    //           ChairpersonReview: {
    //             DepartmentReview: {
    //               PeerReview: {
    //                 IDDSpecialistSuggestion: {
    //                   SubmittedIDDSpecialistSuggestion: {
    //                     id: {
    //                       equals: submittedIDDSpecialistSuggestion.id,
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     });

    //   if (
    //     submittedChairpersonSuggestion &&
    //     submittedIDDSpecialistSuggestion &&
    //     submittedCoordinatorSuggestion
    //   ) {
    //     await prisma.departmentReviewed.create({
    //       data: {
    //         SubmittedChairpersonSuggestion: {
    //           connect: {
    //             id: submittedChairpersonSuggestion.id,
    //           },
    //         },
    //         SubmittedCoordinatorSuggestion: {
    //           connect: {
    //             id: submittedCoordinatorSuggestion.id,
    //           },
    //         },
    //         SubmittedIDDSpecialistSuggestion: {
    //           connect: {
    //             id: submittedIDDSpecialistSuggestion.id,
    //           },
    //         },
    //       },
    //     });
    //   }

      return res.json(submittedIDDSpecialistSuggestion);
    } catch (error: any) {
      console.error(error);
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

      const submittedIDDSpecialistSuggestions =
        await prisma.submittedIDDSpecialistSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).SubmittedIDDSpecialistSuggestion],
          },
        });
      const count = await prisma.submittedIDDSpecialistSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedIDDSpecialistSuggestion],
        },
      });

      return res.json({ submittedIDDSpecialistSuggestions, count });
    } catch (error: any) {
      console.error(error);
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
