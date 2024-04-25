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

  const existingCollege = await prisma.college.findFirst({
    where: {
      name: {
        equals: name,
      },
    },
  });
  if (existingCollege) {
    throw new Error("College name is already used");
  }

  const college = await prisma.college.create({
    data: {
      name,
    },
  });

  return college;
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
  const colleges = await prisma.college.findMany({
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
  const count = await prisma.college.count({
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
  const result = { count, colleges };
  return result;
}

export async function readCollege({ id }: { id: string }) {
  const college = await prisma.college.findUnique({
    where: {
      id,
    },
  });

  return college;
}

export async function deleteCollege({ id, user }: { user: User; id: string }) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to delete this college");
  }

  const college = await prisma.college.delete({
    where: {
      id,
    },
  });

  return college;
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

  const existingCollege = await prisma.college.findFirst({
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
  if (existingCollege) {
    throw new Error("College name is already used");
  }

  const college = await prisma.college.update({
    where: {
      id: id as string,
    },
    data: {
      name,
    },
  });

  return college;
}
