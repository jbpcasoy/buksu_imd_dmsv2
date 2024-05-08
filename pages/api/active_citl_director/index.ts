import {
  createActiveCITLDirector,
  readActiveCITLDirectors,
} from "@/services/activeCITLDirectorService";
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
        cITLDirectorId: Yup.string().required(),
      });
      await validator.validate(req.body);
      const { cITLDirectorId } = validator.cast(req.body);

      const activeCITLDirector = await createActiveCITLDirector({
        cITLDirectorId,
        user,
      });

      return res.json(activeCITLDirector);
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

      const { activeCITLDirectors, count } = await readActiveCITLDirectors({
        skip,
        take,
        filterName,
      });

      return res.json({ activeCITLDirectors, count });
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
