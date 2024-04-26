import prisma from "@/prisma/client";
import { User } from "@prisma/client";

export async function createActiveFaculty({
  facultyId,
  user,
}: {
  user: User;
  facultyId: string;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to set an active faculty");
  }

  const faculty = await prisma.faculty.findFirst({
    where: {
      id: {
        equals: facultyId,
      },
    },
  });
  if (!faculty) {
    throw new Error("Faculty not found");
  }

  const userActiveFacultyCount = await prisma.activeFaculty.count({
    where: {
      Faculty: {
        User: {
          id: {
            equals: faculty.userId,
          },
        },
      },
    },
  });
  if (userActiveFacultyCount > 0) {
    throw new Error("Faculty can only belong to one department");
  }

  const activeFaculty = await prisma.activeFaculty.create({
    data: {
      Faculty: {
        connect: {
          id: faculty.id,
        },
      },
    },
  });

  return activeFaculty;
}

export async function readActiveFaculties({
  skip,
  take,
  user,
  filterName,
  notCoAuthorOfIM,
  optionsIncludeName,
}: {
  skip: number;
  take: number;
  filterName?: string;
  notCoAuthorOfIM?: string;
  user: User;
  optionsIncludeName?: boolean;
}) {
  const activeFaculties = await prisma.activeFaculty.findMany({
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
        notCoAuthorOfIM
          ? {
              AND: [
                {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          IM: {
                            some: {
                              id: {
                                equals: notCoAuthorOfIM,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  Faculty: {
                    User: {
                      id: {
                        not: user.id,
                      },
                    },
                  },
                },
                {
                  Faculty: {
                    CoAuthor: {
                      none: {
                        IM: {
                          id: {
                            equals: notCoAuthorOfIM,
                          },
                        },
                      },
                    },
                  },
                },
              ],
            }
          : {},
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: optionsIncludeName
      ? {
          Faculty: {
            select: {
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
        }
      : undefined,
  });
  const count = await prisma.activeFaculty.count({
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
        notCoAuthorOfIM
          ? {
              AND: [
                {
                  Faculty: {
                    Department: {
                      Faculty: {
                        some: {
                          IM: {
                            some: {
                              id: {
                                equals: notCoAuthorOfIM,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  Faculty: {
                    User: {
                      id: {
                        not: user.id,
                      },
                    },
                  },
                },
                {
                  Faculty: {
                    CoAuthor: {
                      none: {
                        IM: {
                          id: {
                            equals: notCoAuthorOfIM,
                          },
                        },
                      },
                    },
                  },
                },
              ],
            }
          : {},
      ],
    },
  });

  const result = { count, activeFaculties };
  return result;
}

export async function readActiveFaculty({ id }: { id: string }) {
  const activeFaculty = await prisma.activeFaculty.findUnique({
    where: {
      id,
    },
  });

  return activeFaculty;
}

export async function deleteActiveFaculty({
  id,
  user,
}: {
  id: string;
  user: User;
}) {
  if (!user.isAdmin) {
    throw new Error("You are not allowed to remove this active faculty");
  }

  const activeCoordinator = await prisma.activeCoordinator.findFirst({
    where: {
      Coordinator: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: id,
            },
          },
        },
      },
    },
  });
  if (activeCoordinator) {
    throw new Error("Cannot deactivate, please remove coordinator role first");
  }

  const activeChairperson = await prisma.activeChairperson.findFirst({
    where: {
      Chairperson: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: id,
            },
          },
        },
      },
    },
  });
  if (activeChairperson) {
    throw new Error("Cannot deactivate, please remove chairperson role first");
  }

  const activeDean = await prisma.activeDean.findFirst({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: id,
            },
          },
        },
      },
    },
  });
  if (activeDean) {
    throw new Error("Cannot deactivate, please remove dean role first");
  }

  const activeContentSpecialist =
    await prisma.activeContentSpecialist.findFirst({
      where: {
        ContentSpecialist: {
          Faculty: {
            ActiveFaculty: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    });
  if (activeContentSpecialist) {
    throw new Error(
      "Cannot deactivate, please remove content specialist role first"
    );
  }

  const activeFaculty = await prisma.activeFaculty.delete({
    where: {
      id,
    },
  });

  return activeFaculty;
}
