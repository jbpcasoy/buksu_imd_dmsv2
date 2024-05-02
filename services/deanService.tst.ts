import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createDean({
  user,
  activeFacultyId,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a dean");
  }

  let existingDean;
  try {
    existingDean = await prisma.dean.findFirst({
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
    throw new Error("Failed to find Dean");
  }
  if (existingDean) {
    throw new Error("Dean already exists");
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

  try {
    const dean = await prisma.dean.create({
      data: {
        Faculty: {
          connect: {
            id: faculty.id,
          },
        },
      },
    });

    return dean;
  } catch (error: any) {
    throw new Error("Failed to delete Dean");
  }
}

export async function readDeans({
  skip,
  take,
  filterCollegeName,
  filterName,
  sortDirection,
  sortField,
}: {
  skip: number;
  take: number;
  filterName?: string;
  filterCollegeName?: string;
  sortField?: string;
  sortDirection?: string;
}) {
  let deans;
  try {
    deans = await prisma.dean.findMany({
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
            } as Prisma.DeanOrderByWithRelationInput)
          : sortField === "collegeName"
          ? ({
              Faculty: {
                Department: {
                  College: {
                    name: sortDirection ?? "asc",
                  },
                },
              },
            } as Prisma.DeanOrderByWithRelationInput)
          : ({
              updatedAt: "desc",
            } as Prisma.DeanOrderByWithRelationInput),
    });
  } catch (error: any) {
    throw new Error("Failed to find Deans");
  }

  let count;
  try {
    count = await prisma.dean.count({
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
    throw new Error("Failed to count Deans");
  }

  const result = { count, deans };
  return result;
}

export async function readDean({ id }: { id: string }) {
  try {
    const dean = await prisma.dean.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return dean;
  } catch (error: any) {
    throw new Error("Dean not found");
  }
}

export async function deleteDean({ id, user }: { user: User; id: string }) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this dean");
  }

  try {
    const dean = await prisma.dean.delete({
      where: {
        id,
      },
    });

    return dean;
  } catch (error: any) {
    throw new Error("Failed to delete Dean");
  }
}
