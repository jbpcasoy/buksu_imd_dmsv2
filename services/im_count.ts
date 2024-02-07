import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import iMStatusQueryBuilder from "./iMStatusQueryBuilder";

export async function countIMs(
  filterStart: Date | undefined,
  filterEnd: Date | undefined,
  filterStatus: string | undefined,
  filterDepartmentId: string | undefined,
  filterCollegeId: string | undefined
) {
  let startWhere: Prisma.IMWhereInput = {
    createdAt: {
      gte: filterStart,
    },
  };
  let endWhere: Prisma.IMWhereInput = {
    createdAt: {
      lte: filterEnd,
    },
  };
  let statusWhere = iMStatusQueryBuilder(filterStatus)

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              id: {
                contains: filterDepartmentId ?? "",
              },
            },
          },
        },
        {
          Faculty: {
            Department: {
              College: {
                id: {
                  contains: filterCollegeId ?? "",
                },
              },
            },
          },
        },
        statusWhere,
        startWhere,
        endWhere,
      ],
    },
  });
  return count;
}
