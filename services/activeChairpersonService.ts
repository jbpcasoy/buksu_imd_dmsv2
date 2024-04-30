import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveChairperson({
  activeFacultyId,
  user,
}: {
  activeFacultyId: string;
  user: User;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active chairperson");
  }

  let chairperson;
  try {
    chairperson = await prisma.chairperson.findFirst({
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
  } catch (error) {
    throw new Error("Failed to find Chairperson");
  }
  if (!chairperson) {
    throw new Error("Chairperson not found");
  }

  let userActiveChairpersonCount;
  try {
    userActiveChairpersonCount = await prisma.activeChairperson.count({
      where: {
        Chairperson: {
          Faculty: {
            id: {
              equals: chairperson.facultyId,
            },
          },
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count ActiveChairpersons for this User");
  }
  if (userActiveChairpersonCount > 0) {
    throw new Error(
      "Faculty can only be an ActiveChairperson on one Department"
    );
  }

  let department;
  try {
    department = await prisma.department.findFirst({
      where: {
        Faculty: {
          some: {
            Chairperson: {
              id: {
                equals: chairperson.id,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Failed to find Department");
  }
  if (!department) {
    throw new Error("Department not found");
  }

  let departmentActiveChairpersonCount;
  try {
    departmentActiveChairpersonCount = await prisma.activeChairperson.count({
      where: {
        Chairperson: {
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
    throw new Error("Failed to count ActiveChairpersons for this department");
  }
  if (departmentActiveChairpersonCount > 0) {
    throw new Error("Department can only have one active chairperson");
  }

  try {
    const activeChairperson = await prisma.activeChairperson.create({
      data: {
        Chairperson: {
          connect: {
            id: chairperson.id,
          },
        },
      },
    });

    return activeChairperson;
  } catch (error: any) {
    throw new Error("Failed to create ActiveChairperson");
  }
}

export async function readActiveChairpersons({
  filterName,
  skip,
  take,
}: {
  skip: number;
  take: number;
  filterName?: string;
}) {
  let activeChairpersons;
  try {
    activeChairpersons = await prisma.activeChairperson.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            Chairperson: {
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
    throw new Error("Failed to find ActiveChairpersons");
  }

  let count;
  try {
    count = await prisma.activeChairperson.count({
      where: {
        AND: [
          {
            Chairperson: {
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
    throw new Error("Failed to count ActiveChairpersons");
  }

  const result = { count, activeChairpersons };
  return result;
}

export async function readActiveChairperson({ id }: { id: string }) {
  try {
    const activeChairperson = await prisma.activeChairperson.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return activeChairperson;
  } catch (error: any) {
    throw new Error("ActiveChairperson not found");
  }
}

export async function readActiveChairpersonByChairperson({
  id,
}: {
  id: string;
}) {
  let activeChairperson;
  try {
    activeChairperson = await prisma.activeChairperson.findFirst({
      where: {
        AND: [
          {
            Chairperson: {
              id: {
                equals: id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveChairperson for this Chairperson");
  }
  if (!activeChairperson) {
    throw new Error("ActiveChairperson not found for this Chairperson");
  }

  return activeChairperson;
}

export async function readActiveChairpersonByUser({ user }: { user: User }) {
  let activeChairperson;
  try {
    activeChairperson = await prisma.activeChairperson.findFirst({
      where: {
        AND: [
          {
            Chairperson: {
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
    throw new Error("Failed to find ActiveChairperson for this User");
  }
  if (!activeChairperson) {
    throw new Error("ActiveChairperson not found for this User");
  }

  return activeChairperson;
}

export async function deleteActiveChairperson({ id }: { id: string }) {
  try {
    const activeChairperson = await prisma.activeChairperson.delete({
      where: {
        id,
      },
    });

    return activeChairperson;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveChairperson");
  }
}
