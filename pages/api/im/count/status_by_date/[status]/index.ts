import prisma from "@/prisma/client";
import { countIMs } from "@/services/iMService";
import logger from "@/services/logger";
import type { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getHandler = async () => {
    try {
      const validator = Yup.object({
        "filter[departmentId]": Yup.string().optional(),
        "filter[collegeId]": Yup.string().optional(),
        "filter[status]": Yup.string()
          .oneOf([
            "IMERC_CITL_DIRECTOR_ENDORSED",
            "IMERC_CITL_IDD_COORDINATOR_ENDORSED",
            "IMERC_CITL_REVISED",
            "IMERC_CITL_REVIEWED",
            "IMERC_QAMIS_DEPARTMENT_ENDORSED",
            "IMERC_QAMIS_REVISED",
            "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED",
            "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED",
            "IMPLEMENTATION_CITL_REVISED",
            "IMPLEMENTATION_CITL_REVIEWED",
            "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED",
            "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED",
            "IMPLEMENTATION_DEPARTMENT_REVISED",
            "IMPLEMENTATION_DEPARTMENT_REVIEWED",
            "IMPLEMENTATION_DEPARTMENT_REVIEW",
            "IMPLEMENTATION_DRAFT",
          ])
          .optional()
          .transform((originalValue) => {
            return originalValue === "" ? undefined : originalValue;
          }),
        "filter[start]": Yup.date().optional(),
        "filter[end]": Yup.date().optional(),
      });
      await validator.validate(req.query);
      const { status } = req.query;

      const {
        "filter[collegeId]": filterCollegeId,
        "filter[departmentId]": filterDepartmentId,
        "filter[status]": filterStatus,
        "filter[start]": filterStart,
        "filter[end]": filterEnd,
      } = validator.cast(req.query);

      const departments = await prisma.department.findMany();
      const statuses = [
        "IMERC_CITL_DIRECTOR_ENDORSED",
        "IMERC_CITL_IDD_COORDINATOR_ENDORSED",
        "IMERC_CITL_REVISED",
        "IMERC_CITL_REVIEWED",
        "IMERC_QAMIS_DEPARTMENT_ENDORSED",
        "IMERC_QAMIS_REVISED",
        "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED",
        "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED",
        "IMPLEMENTATION_CITL_REVISED",
        "IMPLEMENTATION_CITL_REVIEWED",
        "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED",
        "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED",
        "IMPLEMENTATION_DEPARTMENT_REVISED",
        "IMPLEMENTATION_DEPARTMENT_REVIEWED",
        "IMPLEMENTATION_DEPARTMENT_REVIEW",
        "IMPLEMENTATION_DRAFT",
      ];
      let data: { [department: string]: number } = {};

      for (let department of departments) {
        data = {
          ...data,
          [department.name]: await countIMs(
            filterStart,
            filterEnd,
            status as string,
            undefined,
            filterCollegeId
          ),
        };
      }

      return res.json(data);
    } catch (error: any) {
      logger.error(error);
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
