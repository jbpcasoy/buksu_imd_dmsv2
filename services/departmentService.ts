import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createDepartment({
  collegeId,
  name,
  user,
}: {
  user: User;
  name: string;
  collegeId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a department");
  }

  let existingDepartment;
  try {
    existingDepartment = await prisma.department.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing Department");
  }
  if (existingDepartment) {
    throw new Error("Department name is already used");
  }

  let college;
  try {
    college = await prisma.college.findFirst({
      where: {
        id: {
          equals: collegeId,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find College");
  }
  if (!college) {
    throw new Error("College not found");
  }

  try {
    const department = await prisma.department.create({
      data: {
        name,
        College: {
          connect: {
            id: college.id,
          },
        },
      },
    });

    return department;
  } catch (error: any) {
    throw new Error("Failed to create Department");
  }
}

export async function readDepartments({
  skip,
  take,
  filterCollegeId,
  filterCollegeName,
  filterName,
  sortDirection,
  sortField,
}: {
  skip: number;
  take: number;
  filterName?: string;
  filterCollegeId?: string;
  filterCollegeName?: string;
  sortField?: string;
  sortDirection?: string;
}) {
  let departments;
  try {
    departments = await prisma.department.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            name: {
              contains: filterName,
              mode: "insensitive",
            },
          },
          {
            College: {
              id: {
                contains: filterCollegeId,
              },
            },
          },
          {
            College: {
              name: {
                contains: filterCollegeName,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      orderBy:
        sortField === "name"
          ? ({
              name: sortDirection ?? "asc",
            } as Prisma.DepartmentOrderByWithRelationInput)
          : sortField === "collegeName"
          ? ({
              College: {
                name: sortDirection ?? "asc",
              },
            } as Prisma.DepartmentOrderByWithRelationInput)
          : ({
              name: sortDirection ?? "asc",
            } as Prisma.DepartmentOrderByWithRelationInput),
    });
  } catch (error: any) {
    throw new Error("Failed to find Departments");
  }

  let count;
  try {
    count = await prisma.department.count({
      where: {
        AND: [
          {
            name: {
              contains: filterName,
              mode: "insensitive",
            },
          },
          {
            College: {
              id: {
                contains: filterCollegeId,
              },
            },
          },
          {
            College: {
              name: {
                contains: filterCollegeName,
                mode: "insensitive",
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count departments");
  }

  const result = { count, departments };
  return result;
}

export async function readDepartment({ id }: { id: string }) {
  try {
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
    });
    return department;
  } catch (error: any) {
    throw new Error("Department not found");
  }
}

export async function updateDepartment({
  id,
  name,
  user,
}: {
  id: string;
  user: User;
  name: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to update this department");
  }

  let existingDepartment;
  try {
    existingDepartment = await prisma.department.findFirst({
      where: {
        AND: [
          {
            name: {
              equals: name,
            },
          },
          {
            id: {
              not: id as string,
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing Department");
  }
  if (existingDepartment) {
    throw new Error("Department name is already used");
  }

  const department = await prisma.department.update({
    where: {
      id: id as string,
    },
    data: {
      name,
    },
  });

  return department;
}

export async function deleteDepartment({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this department");
  }

  try {
    const department = await prisma.department.delete({
      where: {
        id,
      },
    });

    return department;
  } catch (error: any) {
    throw new Error("Failed to delete Department");
  }
}
