import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createContentSpecialist({
  user,
  activeFacultyId,
}: {
  user: User;
  activeFacultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a content specialist");
  }

  let existingContentSpecialist;
  try {
    existingContentSpecialist = await prisma.contentSpecialist.findFirst({
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
    throw new Error("Failed to find existing ContentSpecialist");
  }
  if (existingContentSpecialist) {
    throw new Error("Content specialist already exists");
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
    const contentSpecialist = await prisma.contentSpecialist.create({
      data: {
        Faculty: {
          connect: {
            id: faculty.id,
          },
        },
      },
    });

    return contentSpecialist;
  } catch (error: any) {
    throw new Error("Failed to create ContentSpecialist");
  }
}

export async function readContentSpecialists({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterName,
}: {
  skip: number;
  take: number;
  filterName?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  //   FIXME Why do we have no sort here?
  let contentSpecialists;
  try {
    contentSpecialists = await prisma.contentSpecialist.findMany({
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
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ContentSpecialists");
  }

  let count;
  try {
    count = await prisma.contentSpecialist.count({
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
    throw new Error("Failed to count ContentSpecialists");
  }

  const result = { count, contentSpecialists };
  return result;
}

export async function readContentSpecialist({ id }: { id: string }) {
  try {
    const contentSpecialist = await prisma.contentSpecialist.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return contentSpecialist;
  } catch (error: any) {
    throw new Error("ContentSpecialist not found");
  }
}

export async function deleteContentSpecialist({
  id,
  user,
}: {
  user: User;
  id: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this content specialist");
  }

  try {
    const contentSpecialist = await prisma.contentSpecialist.delete({
      where: {
        id,
      },
    });

    return contentSpecialist;
  } catch (error: any) {
    throw new Error("Failed to delete ContentSpecialist");
  }
}
