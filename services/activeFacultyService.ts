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

  let faculty;
  try {
    faculty = await prisma.faculty.findFirst({
      where: {
        id: {
          equals: facultyId,
        },
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find Faculty");
  }
  if (!faculty) {
    throw new Error("Faculty not found");
  }

  let userActiveFacultyCount;
  try {
    userActiveFacultyCount = await prisma.activeFaculty.count({
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
  } catch (error: any) {
    throw new Error("Failed to count current ActiveFaculties");
  }
  if (userActiveFacultyCount > 0) {
    throw new Error("Faculty can only belong to one department");
  }

  try {
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
  } catch (error: any) {
    throw new Error("Failed to create ActiveFaculty");
  }
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
  let activeFaculties;
  try {
    activeFaculties = await prisma.activeFaculty.findMany({
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveFaculties");
  }

  let count;
  try {
    count = await prisma.activeFaculty.count({
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
  } catch (error: any) {
    throw new Error("Failed to count ActiveFaculties");
  }

  const result = { count, activeFaculties };
  return result;
}

export async function readActiveFaculty({ id }: { id: string }) {
  try {
    const activeFaculty = await prisma.activeFaculty.findUnique({
      where: {
        id,
      },
    });

    return activeFaculty;
  } catch (error: any) {
    throw new Error("ActiveFaculty not found");
  }
}

export async function readActiveFacultyMe({ user }: { user: User }) {
  let activeFaculty;
  try {
    activeFaculty = await prisma.activeFaculty.findFirst({
      where: {
        AND: [
          {
            Faculty: {
              userId: {
                equals: user.id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find users ActiveFaculty");
  }
  if (!activeFaculty) {
    throw new Error("ActiveFaculty not found");
  }

  return activeFaculty;
}

export async function readActiveFacultyByFaculty({ id }: { id: string }) {
  let activeFaculty;
  try {
    activeFaculty = await prisma.activeFaculty.findFirst({
      where: {
        AND: [
          {
            Faculty: {
              id: {
                equals: id,
              },
            },
          },
        ],
      },
    });
  } catch (error: any) {
    throw new Error("Failed to find ActiveFaculty");
  }
  if (!activeFaculty) {
    throw new Error("ActiveFaculty not found");
  }

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

  let activeCoordinator;
  try {
    activeCoordinator = await prisma.activeCoordinator.findFirst({
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveCoordinator");
  }
  if (activeCoordinator) {
    throw new Error("Cannot deactivate, please remove coordinator role first");
  }

  let activeChairperson;
  try {
    activeChairperson = await prisma.activeChairperson.findFirst({
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveChairperson");
  }
  if (activeChairperson) {
    throw new Error("Cannot deactivate, please remove chairperson role first");
  }

  let activeDean;
  try {
    activeDean = await prisma.activeDean.findFirst({
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveDean");
  }
  if (activeDean) {
    throw new Error("Cannot deactivate, please remove dean role first");
  }

  let activeContentSpecialist;
  try {
    activeContentSpecialist = await prisma.activeContentSpecialist.findFirst({
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
  } catch (error: any) {
    throw new Error("Failed to find ActiveContentSpecialist");
  }
  if (activeContentSpecialist) {
    throw new Error(
      "Cannot deactivate, please remove content specialist role first"
    );
  }

  try {
    const activeFaculty = await prisma.activeFaculty.delete({
      where: {
        id,
      },
    });

    return activeFaculty;
  } catch (error: any) {
    throw new Error("Failed to delete ActiveFaculty");
  }
}
