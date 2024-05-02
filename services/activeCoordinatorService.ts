import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveCoordinator({
  user,
  activeFacultyId,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active coordinator");
  }

  let coordinator;
  try {
    coordinator = await prisma.coordinator.findFirst({
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
    throw new Error("Failed to find Coordinator");
  }
  if (!coordinator) {
    throw new Error("Coordinator not found");
  }

  let userActiveCoordinatorCount;
  try {
    userActiveCoordinatorCount = await prisma.activeCoordinator.count({
      where: {
        Coordinator: {
          Faculty: {
            id: {
              equals: coordinator.facultyId,
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count ActiveCoordinator");
  }
  if (userActiveCoordinatorCount > 0) {
    throw new Error(
      "Faculty can only be an active coordinator on one department"
    );
  }

  let department;
  try {
    department = await prisma.department.findFirst({
      where: {
        Faculty: {
          some: {
            Coordinator: {
              id: {
                equals: coordinator.id,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find Department");
  }
  if (!department) {
    throw new Error("Department not found");
  }

  let departmentActiveCoordinatorCount;
  try {
    departmentActiveCoordinatorCount = await prisma.activeCoordinator.count({
      where: {
        Coordinator: {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count ActiveCoordinator for this Department");
  }
  if (departmentActiveCoordinatorCount > 0) {
    throw new Error("Department can only have one active coordinator");
  }

  try {
    const activeCoordinator = await prisma.activeCoordinator.create({
      data: {
        Coordinator: {
          connect: {
            id: coordinator.id,
          },
        },
      },
    });

    return activeCoordinator;
  } catch (error: any) {
    throw new Error("Failed to create ActiveCoordinator");
  }
}

export async function readActiveCoordinators({
  skip,
  take,
  filterName,
}: {
  skip: number;
  take: number;
  filterName?: string;
}) {
  let activeCoordinators;
  try {
    activeCoordinators = await prisma.activeCoordinator.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            Coordinator: {
              Faculty: {
                User: {
                  name: {
                    contains: filterName,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    throw new Error("Failed to find ActiveCoordinators");
  }

  let count;
  try {
    count = await prisma.activeCoordinator.count({
      where: {
        AND: [
          {
            Coordinator: {
              Faculty: {
                User: {
                  name: {
                    contains: filterName,
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
    throw new Error("Failed to count ActiveCoordinator");
  }

  const result = { count, activeCoordinators };
  return result;
}

export async function readActiveCoordinatorByUser({ user }: { user: User }) {
  let activeCoordinator;
  try {
    activeCoordinator = await prisma.activeCoordinator.findFirst({
      where: {
        AND: [
          {
            Coordinator: {
              Faculty: {
                userId: {
                  equals: user.id,
                },
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    throw new Error("Failed to find ActiveCoordinator for this User");
  }
  if (!activeCoordinator) {
    throw new Error("ActiveCoordinator not found for this User");
  }

  return activeCoordinator;
}

export async function readActiveCoordinatorByCoordinator({
  id,
}: {
  id: string;
}) {
  let activeCoordinator;
  try {
    activeCoordinator = await prisma.activeCoordinator.findFirst({
      where: {
        AND: [
          {
            Coordinator: {
              id: {
                equals: id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveCoordinator for this Coordinator");
  }
  if (!activeCoordinator) {
    throw new Error("ActiveCoordinator not found for this Coordinator");
  }

  return activeCoordinator;
}

export async function readActiveCoordinator({ id }: { id: string }) {
  try {
    const activeCoordinator = await prisma.activeCoordinator.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return activeCoordinator;
  } catch (error: any) {
    throw new Error("ActiveCoordinator not found");
  }
}

export async function deleteActiveCoordinator({
  user,
  id,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to remove an active coordinator");
  }

  try {
    const activeCoordinator = await prisma.activeCoordinator.delete({
      where: {
        id,
      },
    });

    return activeCoordinator;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveCoordinator");
  }
}
