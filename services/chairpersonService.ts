import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createChairperson({
  activeFacultyId,
  user,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a chairperson");
  }

  let faculty;
  try {
    faculty = await prisma.faculty.findFirst({
      where: {
        ActiveFaculty: {
          id: {
            equals: activeFacultyId,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find Faculty");
  }
  if (!faculty) {
    throw new Error("Faculty not found");
  }

  let existingChairperson;
  try {
    existingChairperson = await prisma.chairperson.findFirst({
      where: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: activeFacultyId,
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing Chairperson");
  }
  if (existingChairperson) {
    throw new Error("Chairperson already exists");
  }

  let chairperson;
  try {
    chairperson = await prisma.chairperson.create({
      data: {
        Faculty: {
          connect: {
            id: faculty.id,
          },
        },
      },
    });

    return chairperson;
  } catch (error: any) {
    throw new Error("Failed to create Chairperson");
  }
}

export async function readChairpersons({
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
  let chairpersons;
  try {
    chairpersons = await prisma.chairperson.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            Faculty: {
              User: {
                name: {
                  contains: filterName,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            Faculty: {
              Department: {
                name: {
                  contains: filterDepartmentName,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            Faculty: {
              Department: {
                College: {
                  name: {
                    contains: filterCollegeName,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      orderBy:
        sortField === "name"
          ? ({
              Faculty: {
                User: {
                  name: sortDirection ?? "asc",
                },
              },
            } as Prisma.FacultyOrderByWithRelationInput)
          : sortField === "departmentName"
          ? ({
              Faculty: {
                Department: {
                  name: sortDirection ?? "asc",
                },
              },
            } as Prisma.FacultyOrderByWithRelationInput)
          : sortField === "collegeName"
          ? ({
              Faculty: {
                Department: {
                  College: {
                    name: sortDirection ?? "asc",
                  },
                },
              },
            } as Prisma.FacultyOrderByWithRelationInput)
          : ({
              updatedAt: "desc",
            } as Prisma.FacultyOrderByWithRelationInput),
    });
  } catch (error: any) {
    throw new Error("Failed to find chairpersons");
  }

  let count;
  try {
    count = await prisma.chairperson.count({
      where: {
        AND: [
          {
            Faculty: {
              User: {
                name: {
                  contains: filterName,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            Faculty: {
              Department: {
                name: {
                  contains: filterDepartmentName,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            Faculty: {
              Department: {
                College: {
                  name: {
                    contains: filterCollegeName,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count chairpersons");
  }

  const result = { count, chairpersons };
  return result;
}

export async function readChairperson({ id }: { id: string }) {
  try {
    const chairperson = await prisma.chairperson.findUnique({
      where: {
        id,
      },
    });

    return chairperson;
  } catch (error: any) {
    throw new Error("Chairperson not found");
  }
}

export async function deleteChairperson({
  id,
  user,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this chairperson");
  }

  try {
    const chairperson = await prisma.chairperson.delete({
      where: {
        id,
      },
    });

    return chairperson;
  } catch (error: any) {
    throw new Error("Failed to delete chairperson");
  }
}
