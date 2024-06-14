import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createCoordinator({
  user,
  activeFacultyId,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a coordinator");
  }

  let existingCoordinator;
  try {
    existingCoordinator = await prisma.coordinator.findFirst({
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
    throw new Error("Failed to find existing Coordinator");
  }
  if (existingCoordinator) {
    throw new Error("Coordinator already exists");
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
    const coordinator = await prisma.coordinator.create({
      data: {
        Faculty: {
          connect: {
            id: faculty.id,
          },
        },
      },
    });

    return coordinator;
  } catch (error: any) {
    throw new Error("Failed to create Coordinator");
  }
}

export async function readCoordinators({
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
  let coordinators;
  try {
    coordinators = await prisma.coordinator.findMany({
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
    throw new Error("Failed to find Coordinators");
  }
  let count;
  try {
    count = await prisma.coordinator.count({
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
    throw new Error("Failed to count Coordinators");
  }

  const result = { count, coordinators };
  return result;
}

export async function readCoordinator({ id }: { id: string }) {
  try {
    const coordinator = await prisma.coordinator.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return coordinator;
  } catch (error: any) {
    throw new Error("Coordinator not found");
  }
}

export async function deleteCoordinator({
  user,
  id,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this coordinator");
  }

  try {
    const coordinator = await prisma.coordinator.delete({
      where: {
        id,
      },
    });

    return coordinator;
  } catch (error: any) {
    throw new Error("Failed to delete Coordinator");
  }
}
