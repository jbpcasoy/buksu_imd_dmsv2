import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveContentSpecialist({
  user,
  activeFacultyId,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active content specialist");
  }

  let contentSpecialist;
  try {
    contentSpecialist = await prisma.contentSpecialist.findFirst({
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
    throw new Error("Failed to find ContentSpecialist");
  }
  if (!contentSpecialist) {
    throw new Error("ContentSpecialist not found");
  }

  let userActiveContentSpecialistCount;
  try {
    userActiveContentSpecialistCount =
      await prisma.activeContentSpecialist.count({
        where: {
          ContentSpecialist: {
            Faculty: {
              id: {
                equals: contentSpecialist.facultyId,
              },
            },
          },
        },
      });
  } catch (error) {
    throw new Error(
      "Failed to count ActiveContentSpecialist for this ContentSpecialist"
    );
  }
  if (userActiveContentSpecialistCount > 0) {
    throw new Error(
      "Faculty can only be an active content specialist on one department"
    );
  }

  let department;
  try {
    department = await prisma.department.findFirst({
      where: {
        Faculty: {
          some: {
            ContentSpecialist: {
              id: {
                equals: contentSpecialist.id,
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

  let departmentActiveContentSpecialistCount;
  try {
    departmentActiveContentSpecialistCount =
      await prisma.activeContentSpecialist.count({
        where: {
          ContentSpecialist: {
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
    throw new Error(
      "Failed to count ActiveContentSpecialist for this Department"
    );
  }
  if (departmentActiveContentSpecialistCount > 0) {
    throw new Error("Department can only have one active content specialist");
  }

  try {
    const activeContentSpecialist = await prisma.activeContentSpecialist.create(
      {
        data: {
          ContentSpecialist: {
            connect: {
              id: contentSpecialist.id,
            },
          },
        },
      }
    );

    return activeContentSpecialist;
  } catch (error: any) {
    throw new Error("Failed to create ActiveContentSpecialist");
  }
}

export async function readActiveContentSpecialists({
  skip,
  take,
  filterName,
}: {
  skip: number;
  take: number;
  filterName?: string;
}) {
  let activeContentSpecialists;
  try {
    activeContentSpecialists = await prisma.activeContentSpecialist.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            ContentSpecialist: {
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
    throw new Error("Failed to find ActiveContentSpecialists");
  }

  let count;
  try {
    count = await prisma.activeContentSpecialist.count({
      where: {
        AND: [
          {
            ContentSpecialist: {
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
    throw new Error("Failed to count ActiveContentSpecialists");
  }

  const result = { count, activeContentSpecialists };
  return result;
}

export async function readActiveContentSpecialistByUser({
  user,
}: {
  user: User;
}) {
  let activeContentSpecialist;

  try {
    activeContentSpecialist = await prisma.activeContentSpecialist.findFirst({
      where: {
        AND: [
          {
            ContentSpecialist: {
              Faculty: {
                User: {
                  id: user.id,
                },
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveContentSpecialist for this User");
  }
  if (!activeContentSpecialist) {
    throw new Error("ActiveContentSpecialist not found for this User");
  }

  return activeContentSpecialist;
}

export async function readActiveContentSpecialistByContentSpecialist({
  id,
}: {
  id: string;
}) {
  let activeContentSpecialist;

  try {
    activeContentSpecialist = await prisma.activeContentSpecialist.findFirst({
      where: {
        AND: [
          {
            ContentSpecialist: {
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
      "Failed to find ActiveContentSpecialist for this ContentSpecialist"
    );
  }
  if (!activeContentSpecialist) {
    throw new Error(
      "ActiveContentSpecialist not found for this ContentSpecialist"
    );
  }

  return activeContentSpecialist;
}

export async function readActiveContentSpecialist({ id }: { id: string }) {
  let activeContentSpecialist;

  try {
    activeContentSpecialist =
      await prisma.activeContentSpecialist.findUniqueOrThrow({
        where: {
          id,
        },
      });
  } catch (error: any) {
    throw new Error("ActiveContentSpecialist not found");
  }

  return activeContentSpecialist;
}

export async function deleteActiveContentSpecialist({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  if (!user.isAdmin) {
    throw new Error(
      "You are not allowed to remove an active content specialist"
    );
  }

  try {
    const activeContentSpecialist = await prisma.activeContentSpecialist.delete(
      {
        where: {
          id,
        },
      }
    );

    return activeContentSpecialist;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveContentSpecialist");
  }
}
