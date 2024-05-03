import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createIDDCoordinator({
  user,
  userId,
}: {
  user: User;
  userId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create an IDD coordinator");
  }

  let existingIDDCoordinator;
  try {
    existingIDDCoordinator = await prisma.iDDCoordinator.findFirst({
      where: {
        User: {
          id: {
            equals: userId,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing IDD Coordinator");
  }
  if (existingIDDCoordinator) {
    throw new Error("IDD coordinator already exists");
  }

  try {
    const iDDCoordinator = await prisma.iDDCoordinator.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return iDDCoordinator;
  } catch (error: any) {
    throw new Error("Failed to create IDDCoordinator");
  }
}

export async function readIDDCoordinators({
  skip,
  take,
  filterName,
  sortDirection,
  sortField,
}: {
  skip: number;
  take: number;
  filterName?: string;
  sortField?: string;
  sortDirection?: string;
}) {
  let iDDCoordinators;
  try {
    iDDCoordinators = await prisma.iDDCoordinator.findMany({
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
        ],
      },
      orderBy:
        sortField === "name"
          ? ({
              User: {
                name: sortDirection ?? "asc",
              },
            } as Prisma.IDDCoordinatorOrderByWithRelationInput)
          : ({
              User: {
                name: sortDirection ?? "asc",
              },
            } as Prisma.IDDCoordinatorOrderByWithRelationInput),
    });
  } catch (error: any) {
    throw new Error("Failed to find IDDCoordinators");
  }

  let count;
  try {
    count = await prisma.iDDCoordinator.count({
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
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count IDDCoordinators");
  }

  const result = { count, iDDCoordinators };
  return result;
}

export async function readIDDCoordinator({ id }: { id: string }) {
  try {
    const iDDCoordinator = await prisma.iDDCoordinator.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return iDDCoordinator;
  } catch (error: any) {
    throw new Error("IDDCoordinator not found");
  }
}

export async function deleteIDDCoordinator({
  id,
  user,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this IDD coordinator");
  }

  try {
    const iDDCoordinator = await prisma.iDDCoordinator.delete({
      where: {
        id,
      },
    });
    return iDDCoordinator;
  } catch (error: any) {
    throw new Error("Failed to delete IDDCoordinator");
  }
}
