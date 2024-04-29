import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createCollege({
  user,
  name,
}: {
  user: User;
  name: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to create a college");
  }

  let existingCollege;
  try {
    existingCollege = await prisma.college.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing College");
  }
  if (existingCollege) {
    throw new Error("College name is already used");
  }

  let college;
  try {
    college = await prisma.college.create({
      data: {
        name,
      },
    });

    return college;
  } catch (error: any) {
    throw new Error("Failed to create college");
  }
}

export async function readColleges({
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
  let colleges;
  try {
    colleges = await prisma.college.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            name: {
              contains: filterName,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        [sortField || "name"]: sortDirection || "asc",
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find colleges");
  }

  let count;
  try {
    count = await prisma.college.count({
      where: {
        AND: [
          {
            name: {
              contains: filterName,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to count colleges");
  }

  const result = { count, colleges };
  return result;
}

export async function readCollege({ id }: { id: string }) {
  try {
    const college = await prisma.college.findUnique({
      where: {
        id,
      },
    });

    return college;
  } catch (error: any) {
    throw new Error("Failed to find college");
  }
}

export async function deleteCollege({ id, user }: { user: User; id: string }) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this college");
  }

  try {
    const college = await prisma.college.delete({
      where: {
        id,
      },
    });

    return college;
  } catch (error: any) {
    throw new Error("Failed to delete college");
  }
}

export async function updateCollege({
  id,
  name,
  user,
}: {
  user: User;
  id: string;
  name: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to update this college");
  }

  let existingCollege;
  try {
    existingCollege = await prisma.college.findFirst({
      where: {
        AND: [
          {
            name: {
              equals: name,
            },
          },
          {
            id: {
              equals: id,
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find existing College");
  }
  if (existingCollege) {
    throw new Error("College name is already used");
  }

  try {
    const college = await prisma.college.update({
      where: {
        id: id as string,
      },
      data: {
        name,
      },
    });

    return college;
  } catch (error: any) {
    throw new Error("Failed to update college");
  }
}
