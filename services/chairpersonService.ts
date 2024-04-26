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

  const existingChairperson = await prisma.chairperson.findFirst({
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
  if (existingChairperson) {
    throw new Error("Chairperson already exists");
  }

  const faculty = await prisma.faculty.findFirstOrThrow({
    where: {
      ActiveFaculty: {
        id: {
          equals: activeFacultyId,
        },
      },
    },
  });

  const chairperson = await prisma.chairperson.create({
    data: {
      Faculty: {
        connect: {
          id: faculty.id,
        },
      },
    },
  });

  return chairperson;
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
  const chairpersons = await prisma.chairperson.findMany({
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
  const count = await prisma.chairperson.count({
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

  const result = { count, chairpersons };
  return result;
}

export async function readChairperson({ id }: { id: string }) {
  const chairperson = await prisma.chairperson.findUnique({
    where: {
      id,
    },
  });

  return chairperson;
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

  const chairperson = await prisma.chairperson.delete({
    where: {
      id,
    },
  });

  return chairperson;
}
