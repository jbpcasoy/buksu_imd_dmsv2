import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveDean({
  user,
  activeFacultyId,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active dean");
  }

  let dean;
  try {
    dean = await prisma.dean.findFirst({
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
  if (!dean) {
    throw new Error("Dean not found");
  }

  let userActiveDeanCount;
  try {
    userActiveDeanCount = await prisma.activeDean.count({
      where: {
        Dean: {
          Faculty: {
            id: {
              equals: dean.facultyId,
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count ActiveDeans for this User");
  }
  if (userActiveDeanCount > 0) {
    throw new Error("Faculty can only be an active dean on one college");
  }

  let college;
  try {
    college = await prisma.college.findFirst({
      where: {
        Department: {
          some: {
            Faculty: {
              some: {
                Dean: {
                  id: {
                    equals: dean.id,
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find College");
  }
  if (!college) {
    throw new Error("College not found");
  }

  let collegeActiveDeanCount;
  try {
    collegeActiveDeanCount = await prisma.activeDean.count({
      where: {
        Dean: {
          Faculty: {
            Department: {
              College: {
                id: {
                  equals: college.id,
                },
              },
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count ActiveDeans for this College");
  }
  if (collegeActiveDeanCount > 0) {
    throw new Error("College can only have one active dean");
  }

  try {
    const activeDean = await prisma.activeDean.create({
      data: {
        Dean: {
          connect: {
            id: dean.id,
          },
        },
      },
    });

    return activeDean;
  } catch (error: any) {
    throw new Error("Failed to create ActiveDean");
  }
}

export async function readActiveDeans({
  skip,
  take,
  filterName,
}: {
  skip: number;
  take: number;
  filterName?: string;
}) {
  let activeDeans;
  try {
    activeDeans = await prisma.activeDean.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            Dean: {
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveDeans");
  }

  let count;
  try {
    count = await prisma.activeDean.count({
      where: {
        AND: [
          {
            Dean: {
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
    throw new Error("Failed to count ActiveDeans");
  }

  const result = { count, activeDeans };
  return result;
}

export async function readActiveDeanByUser({ user }: { user: User }) {
  let activeDean;
  try {
    activeDean = await prisma.activeDean.findFirst({
      where: {
        AND: [
          {
            Dean: {
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveDean for this User");
  }
  if (!activeDean) {
    throw new Error("ActiveDean not found for this User");
  }

  return activeDean;
}

export async function readActiveDeanByDean({ id }: { id: string }) {
  let activeDean;
  try {
    // TODO remove all .findFirstOrThrow on routes like these

    activeDean = await prisma.activeDean.findFirst({
      where: {
        AND: [
          {
            Dean: {
              id: {
                equals: id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveDean for this Dean");
  }
  if (!activeDean) {
    throw new Error("ActiveDean not found for this Dean");
  }

  return activeDean;
}

export async function readActiveDean({ id }: { id: string }) {
  let activeDean;
  try {
    activeDean = await prisma.activeDean.findUniqueOrThrow({
      where: {
        id,
      },
    });
  } catch (error: any) {
    throw new Error("ActiveDean not found");
  }

  return activeDean;
}

export async function deleteActiveDean({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to remove an active dean");
  }

  try {
    const activeDean = await prisma.activeDean.delete({
      where: {
        id,
      },
    });

    return activeDean;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveDean");
  }
}
