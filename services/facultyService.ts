import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createFaculty({
  user,
  departmentId,
  userId,
}: {
  user: User;
  userId: string;
  departmentId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a faculty");
  }

  const existingFaculty = await prisma.faculty.findFirst({
    where: {
      userId: {
        equals: userId,
      },
      departmentId: {
        equals: departmentId,
      },
    },
  });
  if (existingFaculty) {
    throw new Error("Faculty already exists");
  }

  const faculty = await prisma.faculty.create({
    data: {
      User: {
        connect: {
          id: userId,
        },
      },
      Department: {
        connect: {
          id: departmentId,
        },
      },
    },
  });

  return faculty;
}

export async function readFaculties({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterName,
  sortDirection,
  sortField,
}: {
  skip: number;
  take: number;
  filterName?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
  sortField?: string;
  sortDirection?: string;
}) {
  const faculties = await prisma.faculty.findMany({
    skip,
    take,
    where: {
      AND: [
        {
          User: {
            name: {
              contains: filterName,
              mode: "insensitive",
            },
          },
        },
        {
          Department: {
            name: {
              contains: filterDepartmentName,
              mode: "insensitive",
            },
          },
        },
        {
          Department: {
            College: {
              name: {
                contains: filterCollegeName,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
    orderBy:
      sortField === "name"
        ? ({
            User: {
              name: sortDirection ?? "asc",
            },
          } as Prisma.FacultyOrderByWithRelationInput)
        : sortField === "departmentName"
        ? ({
            Department: {
              name: sortDirection ?? "asc",
            },
          } as Prisma.FacultyOrderByWithRelationInput)
        : sortField === "collegeName"
        ? ({
            Department: {
              College: {
                name: sortDirection ?? "asc",
              },
            },
          } as Prisma.FacultyOrderByWithRelationInput)
        : ({
            updatedAt: "desc",
          } as Prisma.FacultyOrderByWithRelationInput),
  });
  const count = await prisma.faculty.count({
    where: {
      AND: [
        {
          User: {
            name: {
              contains: filterName,
              mode: "insensitive",
            },
          },
        },
        {
          Department: {
            name: {
              contains: filterDepartmentName,
              mode: "insensitive",
            },
          },
        },
        {
          Department: {
            College: {
              name: {
                contains: filterCollegeName,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, faculties };
  return result;
}

export async function readFaculty({ id }: { id: string }) {
  const faculty = await prisma.faculty.findUnique({
    where: {
      id,
    },
  });

  return faculty;
}

export async function deleteFaculty({ id, user }: { user: User; id: string }) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this faculty");
  }

  const faculty = await prisma.faculty.delete({
    where: {
      id,
    },
  });

  return faculty;
}
