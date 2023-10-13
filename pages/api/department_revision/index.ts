import prisma from "@/prisma/client";
import departmentRevisionAbility from "@/services/ability/departmentRevisionAbility";
import userAbility from "@/services/ability/userAbility";
import getServerUser from "@/services/getServerUser";
import { ForbiddenError } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { PrismaClient, User } from "@prisma/client";
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
  const ability = departmentRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        iMFileId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "DepartmentRevision"
      );

      const { iMFileId } = validator.cast(req.body);

      const departmentReview = await prisma.departmentReview.findFirstOrThrow({
        where: {
          IMFile: {
            IM: {
              IMFile: {
                some: {
                  id: {
                    equals: iMFileId,
                  },
                },
              },
            },
          },
        },
      });

      await prisma.submittedPeerSuggestion.findFirstOrThrow({
        where: {
          PeerSuggestion: {
            PeerReview: {
              DepartmentReview: {
                id: {
                  equals: departmentReview.id,
                },
              },
            },
          },
        },
      });

      await prisma.submittedChairpersonSuggestion.findFirstOrThrow({
        where: {
          ChairpersonSuggestion: {
            ChairpersonReview: {
              DepartmentReview: {
                id: {
                  equals: departmentReview.id,
                },
              },
            },
          },
        },
      });

      await prisma.submittedCoordinatorSuggestion.findFirstOrThrow({
        where: {
          CoordinatorSuggestion: {
            CoordinatorReview: {
              DepartmentReview: {
                id: {
                  equals: departmentReview.id,
                },
              },
            },
          },
        },
      });

      const departmentRevision = await prisma.departmentRevision.create({
        data: {
          DepartmentReview: {
            connect: {
              id: departmentReview.id,
            },
          },
          IMFile: {
            connect: {
              id: iMFileId,
            },
          },
        },
      });

      return res.json(departmentRevision);
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
      console.log({ filterName });
      const departmentRevisions = await prisma.departmentRevision.findMany({
        skip,
        take,
        where: {
          AND: [accessibleBy(ability).DepartmentRevision],
        },
      });
      const count = await prisma.departmentRevision.count({
        where: {
          AND: [accessibleBy(ability).DepartmentRevision],
        },
      });

      return res.json({ departmentRevisions, count });
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
