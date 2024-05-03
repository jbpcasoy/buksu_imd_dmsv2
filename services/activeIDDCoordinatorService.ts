import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveIDDCoordinator({
  user,
  iDDCoordinatorId,
}: {
  user: User;
  iDDCoordinatorId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active IDD coordinator");
  }

  let iDDCoordinator;
  try {
    iDDCoordinator = await prisma.iDDCoordinator.findFirst({
      where: {
        id: {
          equals: iDDCoordinatorId,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find IDDCoordinator");
  }
  if (!iDDCoordinator) {
    throw new Error("IDDCoordinator not found");
  }

  let userActiveIDDCoordinatorCount;
  try {
    userActiveIDDCoordinatorCount = await prisma.activeIDDCoordinator.count();
  } catch (error: any) {
    throw new Error("Failed to count active IDDCoordinator");
  }
  if (userActiveIDDCoordinatorCount > 0) {
    throw new Error("There can only be one active IDDCoordinator");
  }

  try {
    const activeIDDCoordinator = await prisma.activeIDDCoordinator.create({
      data: {
        IDDCoordinator: {
          connect: {
            id: iDDCoordinator.id,
          },
        },
      },
    });
    return activeIDDCoordinator;
  } catch (error: any) {
    throw new Error("Failed to create ActiveIDDCoordinator");
  }
}

export async function readActiveIDDCoordinators({
  skip,
  take,
  filterName,
}: {
  skip: number;
  take: number;
  filterName?: string;
}) {
  let activeIDDCoordinators;
  try {
    activeIDDCoordinators = await prisma.activeIDDCoordinator.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            IDDCoordinator: {
              User: {
                name: {
                  contains: filterName,
                  mode: "insensitive",
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveIDDCoordinators");
  }

  let count;
  try {
    count = await prisma.activeIDDCoordinator.count({
      where: {
        AND: [
          {
            IDDCoordinator: {
              User: {
                name: {
                  contains: filterName,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count ActiveIDDCoordinators");
  }

  const result = { count, activeIDDCoordinators };
  return result;
}

export async function readActiveIDDCoordinatorByUser({ user }: { user: User }) {
  let activeIDDCoordinator;
  try {
    activeIDDCoordinator = await prisma.activeIDDCoordinator.findFirst({
      where: {
        AND: [
          {
            IDDCoordinator: {
              userId: {
                equals: user.id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveIDDCoordinator for this User");
  }
  if (!activeIDDCoordinator) {
    throw new Error("ActiveIDDCoordinator not found for this User");
  }

  return activeIDDCoordinator;
}

export async function readActiveIDDCoordinatorByIDDCoordinator({
  id,
}: {
  id: string;
}) {
  let activeIDDCoordinator;
  try {
    activeIDDCoordinator = await prisma.activeIDDCoordinator.findFirst({
      where: {
        AND: [
          {
            IDDCoordinator: {
              id: {
                equals: id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error(
      "Failed to find ActiveIDDCoordinator for this IDDCoordinator"
    );
  }
  if (!activeIDDCoordinator) {
    throw new Error("ActiveIDDCoordinator not found for this IDDCoordinator");
  }

  return activeIDDCoordinator;
}

export async function readActiveIDDCoordinator({ id }: { id: string }) {
  try {
    const activeIDDCoordinator =
      await prisma.activeIDDCoordinator.findUniqueOrThrow({
        where: {
          id,
        },
      });

    return activeIDDCoordinator;
  } catch (error: any) {
    throw new Error("ActiveIDDCoordinator not found");
  }
}

export async function deleteActiveIDDCoordinator({
  id,
  user,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to remove an active IDD coordinator");
  }

  try {
    const activeIDDCoordinator = await prisma.activeIDDCoordinator.delete({
      where: {
        id,
      },
    });

    return activeIDDCoordinator;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveIDDCoordinator");
  }
}
