import prisma from "@/prisma/client";
import { Prisma, User } from "@prisma/client";

export async function createCITLDirector({
  user,
  userId,
}: {
  userId: string;
  user: User;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a CITL director");
  }

  let existingCITLDirector;
  try {
    existingCITLDirector = await prisma.cITLDirector.findFirst({
      where: {
        User: {
          id: {
            equals: userId,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find CITLDirector");
  }
  if (existingCITLDirector) {
    throw new Error("CITL director already exists");
  }

  let cITLDirector;
  try {
    cITLDirector = await prisma.cITLDirector.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to create CITLDirector");
  }

  return cITLDirector;
}

export async function readCITLDirectors({
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
  let cITLDirectors;
  try {
    cITLDirectors = await prisma.cITLDirector.findMany({
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
            } as Prisma.CITLDirectorOrderByWithRelationInput)
          : ({
              updatedAt: "desc",
            } as Prisma.CITLDirectorOrderByWithRelationInput),
    });
  } catch (error: any) {
    throw new Error("Failed to find CITLDirectors");
  }

  let count;
  try {
    count = await prisma.cITLDirector.count({
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
    throw new Error("Failed to count CITLDirectors");
  }

  const results = { count, cITLDirectors };
  return results;
}

export async function readCITLDirector({ id }: { id: string }) {
  try {
    const cITLDirector = await prisma.cITLDirector.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return cITLDirector;
  } catch (error: any) {
    throw new Error("CITLDirector not found");
  }
}

export async function deleteCITLDirector({
  user,
  id,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete CITL director");
  }

  try {
    const cITLDirector = await prisma.cITLDirector.delete({
      where: {
        id,
      },
    });

    return cITLDirector;
  } catch (error: any) {
    throw new Error("Failed to delete CITLDirector");
  }
}
