import {
  createActiveFaculty,
  readActiveFaculties,
} from "@/services/activeFacultyService";
import getServerUser from "@/services/getServerUser";
import logger from "@/services/logger";

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
        facultyId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { facultyId } = validator.cast(req.body);

      const activeFaculty = await createActiveFaculty({ facultyId, user });

      return res.json(activeFaculty);
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
        "filter[notCoAuthorOfIM]": Yup.string().optional(),
        "options[includeName]": Yup.boolean().optional(),
      });

      await validator.validate(req.query);

      const {
        skip,
        take,
        "filter[name]": filterName,
        "filter[notCoAuthorOfIM]": notCoAuthorOfIM,
        "options[includeName]": optionsIncludeName,
      } = validator.cast(req.query);

      const { activeFaculties, count } = await readActiveFaculties({
        skip,
        take,
        user,
        filterName,
        notCoAuthorOfIM,
        optionsIncludeName,
      });

      return res.json({ activeFaculties, count });
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
