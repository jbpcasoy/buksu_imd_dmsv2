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

  let existingFaculty;
  try {
    existingFaculty = await prisma.faculty.findFirst({
      where: {
        userId: {
          equals: userId,
        },
        departmentId: {
          equals: departmentId,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing Faculty");
  }
  if (existingFaculty) {
    throw new Error("Faculty already exists");
  }

  try {
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
  } catch (error: any) {
    throw new Error("Failed to create Faculty");
  }
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
  let faculties;
  try {
    faculties = await prisma.faculty.findMany({
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
  } catch (error: any) {
    throw new Error("Failed to find Faculties");
  }
  let count;
  try {
    count = await prisma.faculty.count({
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
  } catch (error: any) {
    throw new Error("Failed to count Faculties");
  }

  const result = { count, faculties };
  return result;
}

export async function readFaculty({ id }: { id: string }) {
  try {
    const faculty = await prisma.faculty.findUnique({
      where: {
        id,
      },
    });

    return faculty;
  } catch (error: any) {
    throw new Error("Failed to find Faculty");
  }
}

export async function deleteFaculty({ id, user }: { user: User; id: string }) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this faculty");
  }

  try {
    const faculty = await prisma.faculty.delete({
      where: {
        id,
      },
    });

    return faculty;
  } catch (error: any) {
    throw new Error("Failed to delete Faculty");
  }
}
