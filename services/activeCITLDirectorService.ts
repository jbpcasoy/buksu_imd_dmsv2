import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveCITLDirector({
  user,
  cITLDirectorId,
}: {
  user: User;
  cITLDirectorId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active CITL director");
  }

  let cITLDirector;
  try {
    cITLDirector = await prisma.cITLDirector.findFirst({
      where: {
        id: {
          equals: cITLDirectorId,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find CITLDirector");
  }
  if (!cITLDirector) {
    throw new Error("CITLDirector not found");
  }

  let userActiveCITLDirectorCount;
  try {
    userActiveCITLDirectorCount = await prisma.activeCITLDirector.count();
  } catch (error: any) {
    throw new Error("Failed to count activeCITLDirector");
  }
  if (userActiveCITLDirectorCount > 0) {
    throw new Error("There can only be one active CITL Director");
  }

  try {
    const activeCITLDirector = await prisma.activeCITLDirector.create({
      data: {
        CITLDirector: {
          connect: {
            id: cITLDirector.id,
          },
        },
      },
    });

    return activeCITLDirector;
  } catch (error: any) {
    throw new Error("Failed to create ActiveCITLDirector");
  }
}

export async function readActiveCITLDirectors({
  skip,
  take,
  filterName,
}: {
  skip: number;
  take: number;
  filterName?: string;
}) {
  let activeCITLDirectors;
  try {
    activeCITLDirectors = await prisma.activeCITLDirector.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            CITLDirector: {
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
    throw new Error("Failed to find ActiveCITLDirectors");
  }

  let count;
  try {
    count = await prisma.activeCITLDirector.count({
      where: {
        AND: [
          {
            CITLDirector: {
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
    throw new Error("Failed to count ActiveCITLDirectors");
  }

  const result = { count, activeCITLDirectors };
  return result;
}

export async function readActiveCITLDirectorByUser({ user }: { user: User }) {
  let activeCITLDirector;
  try {
    activeCITLDirector = await prisma.activeCITLDirector.findFirst({
      where: {
        AND: [
          {
            CITLDirector: {
              userId: {
                equals: user.id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveCITLDirector for this User");
  }
  if (!activeCITLDirector) {
    throw new Error("ActiveCITLDirector not found for this User");
  }

  return activeCITLDirector;
}

export async function readActiveCITLDirectorByCITLDirector({
  id,
}: {
  id: string;
}) {
  let activeCITLDirector;
  try {
    activeCITLDirector = await prisma.activeCITLDirector.findFirst({
      where: {
        AND: [
          {
            CITLDirector: {
              id: {
                equals: id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveCITLDirector for this CITLDirector");
  }
  if (!activeCITLDirector) {
    throw new Error("ActiveCITLDirector not found for this CITLDirector");
  }

  return activeCITLDirector;
}

export async function readActiveCITLDirector({ id }: { id: string }) {
  try {
    const activeCITLDirector =
      await prisma.activeCITLDirector.findUniqueOrThrow({
        where: {
          id,
        },
      });

    return activeCITLDirector;
  } catch (error: any) {
    throw new Error("ActiveCITLDirector not found");
  }
}

export async function deleteActiveCITLDirector({
  user,
  id,
}: {
  user: User;
  id?: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to remove an active CITL director");
  }

  try {
    const activeCITLDirector = await prisma.activeCITLDirector.delete({
      where: {
        id,
      },
    });

    return activeCITLDirector;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveCITLDirector");
  }
}
