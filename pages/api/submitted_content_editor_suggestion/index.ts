import prisma from "@/prisma/client";
import submittedContentEditorSuggestionAbility from "@/services/ability/submittedContentEditorSuggestionAbility";
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
  const ability = submittedContentEditorSuggestionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        contentEditorSuggestionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedContentEditorSuggestion"
      );
      const { contentEditorSuggestionId } = validator.cast(req.body);
      const submittedContentEditorSuggestion =
        await prisma.submittedContentEditorSuggestion.create({
          data: {
            ContentEditorSuggestion: {
              connect: {
                id: contentEditorSuggestionId as string,
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
    //                 ContentEditorSuggestion: {
    //                   SubmittedContentEditorSuggestion: {
    //                     id: {
    //                       equals: submittedContentEditorSuggestion.id,
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
    //                 ContentEditorSuggestion: {
    //                   SubmittedContentEditorSuggestion: {
    //                     id: {
    //                       equals: submittedContentEditorSuggestion.id,
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
    //     submittedContentEditorSuggestion &&
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
    //         SubmittedContentEditorSuggestion: {
    //           connect: {
    //             id: submittedContentEditorSuggestion.id,
    //           },
    //         },
    //       },
    //     });
    //   }

      return res.json(submittedContentEditorSuggestion);
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

      const submittedContentEditorSuggestions =
        await prisma.submittedContentEditorSuggestion.findMany({
          skip,
          take,
          where: {
            AND: [accessibleBy(ability).SubmittedContentEditorSuggestion],
          },
        });
      const count = await prisma.submittedContentEditorSuggestion.count({
        where: {
          AND: [accessibleBy(ability).SubmittedContentEditorSuggestion],
        },
      });

      return res.json({ submittedContentEditorSuggestions, count });
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
