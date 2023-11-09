import prisma from "@/prisma/client";
import submittedReturnedDepartmentRevisionAbility from "@/services/ability/submittedReturnedDepartmentRevisionAbility";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";
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
  const ability = submittedReturnedDepartmentRevisionAbility({ user });

  const postHandler = async () => {
    try {
      const validator = Yup.object({
        returnedDepartmentRevisionId: Yup.string().required(),
      });
      await validator.validate(req.body);

      ForbiddenError.from(ability).throwUnlessCan(
        "create",
        "SubmittedReturnedDepartmentRevision"
      );

      const { returnedDepartmentRevisionId } = validator.cast(req.body);

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
          where: {
            AND: [accessibleBy(ability).SubmittedReturnedDepartmentRevision],
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      const count = await prisma.submittedReturnedDepartmentRevision.count({
        where: {
          AND: [accessibleBy(ability).SubmittedReturnedDepartmentRevision],
        },
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
