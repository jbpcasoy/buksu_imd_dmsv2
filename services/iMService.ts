import prisma from "@/prisma/client";
import {
  F001Props,
  F003Props,
  F003Suggestion,
  F004Props,
  F005Props,
  F011Props,
  F012Props,
  F013Props,
  F014Props,
  F015Props,
  F015Suggestion,
} from "@/types/forms";
import {
  ActiveFaculty,
  Faculty,
  IMType,
  Prisma,
  Rating,
  User,
} from "@prisma/client";
import iMStatusQueryBuilder from "./iMStatusQueryBuilder";

export async function createIM({
  activeFacultyId,
  user,
  title,
  type,
}: {
  activeFacultyId: string;
  user: User;
  title: string;
  type: IMType;
}) {
  let faculty: Faculty;
  faculty = await prisma.faculty.findFirstOrThrow({
    where: {
      ActiveFaculty: {
        id: {
          equals: activeFacultyId,
        },
      },
    },
  });

  if (!user.isAdmin) {
    if (faculty.userId !== user.id) {
      throw new Error("You are not allowed to create an IM for this user");
    }
  }

  const iM = await prisma.iM.create({
    data: {
      title,
      Faculty: {
        connect: {
          id: faculty.id,
        },
      },
      type,
      Event: {
        create: {
          User: {
            connect: {
              id: user.id,
            },
          },
          type: "IM_CREATED",
        },
      },
    },
  });

  return iM;
}

export async function readIMs({
  skip,
  take,
  filterStatus,
  filterUserName,
  filterCollegeName,
  filterDepartmentName,
  filterTitle,
  sortDirection,
  sortField,
}: {
  skip: number;
  take: number;
  filterStatus?: string;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
  sortField?: string;
  sortDirection?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);
  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy: {
      [sortField || "updatedAt"]: sortDirection || "desc",
    },
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function readIMERCDepartmentToReviseIMs({
  user,
  filterStatus,
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                CITLRevision: {
                  IDDCoordinatorEndorsement: {
                    CITLDirectorEndorsement: {
                      QAMISSuggestion: {
                        SubmittedQAMISSuggestion: {
                          isNot: null,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                CITLRevision: {
                  IDDCoordinatorEndorsement: {
                    CITLDirectorEndorsement: {
                      QAMISSuggestion: {
                        SubmittedQAMISSuggestion: {
                          isNot: null,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}
export async function countIMERCDepartmentToReviseIMs({
  user,
}: {
  user: User;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                CITLRevision: {
                  IDDCoordinatorEndorsement: {
                    CITLDirectorEndorsement: {
                      QAMISSuggestion: {
                        SubmittedQAMISSuggestion: {
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCDepartmentToReviewIMs({
  user,
  filterStatus,
  skip,
  sortDirection,
  sortField,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterTitle,
  filterUserName,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            isNot: null,
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            isNot: null,
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCDepartmentToReviewIMs({
  user,
}: {
  user: User;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCDepartmentToEndorseIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      is: null,
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  Chairperson: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISCoordinatorEndorsement: {
                  Coordinator: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  Dean: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      is: null,
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  Chairperson: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISCoordinatorEndorsement: {
                  Coordinator: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  Dean: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCDepartmentToEndorseIMs({
  user,
}: {
  user: User;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              Faculty: {
                some: {
                  User: {
                    id: {
                      equals: user.id,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      is: null,
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  Chairperson: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISCoordinatorEndorsement: {
                  Coordinator: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  Dean: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCDepartmentReviewedIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCDepartmentReviewedIMs({
  user,
}: {
  user: User;
}) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCDepartmentEndorsedIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      Chairperson: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      Coordinator: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      Chairperson: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      Coordinator: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCDepartmentEndorsedIMs({
  user,
}: {
  user: User;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISChairpersonEndorsement: {
                      Chairperson: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                  {
                    QAMISCoordinatorEndorsement: {
                      Coordinator: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCollegeToEndorseIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: userActiveFaculty.id,
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISDeanEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISDeanEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCollegeToEndorseIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: userActiveFaculty.id,
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISDeanEndorsement: {
                      is: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISCoordinatorEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                  QAMISDeanEndorsement: {
                    QAMISDepartmentEndorsement: {
                      isNot: null,
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCollegeEndorsedIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISDeanEndorsement: {
                      Dean: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISDeanEndorsement: {
                      Dean: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCollegeEndorsedIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              QAMISRevision: {
                OR: [
                  {
                    QAMISDeanEndorsement: {
                      Dean: {
                        Faculty: {
                          User: {
                            id: {
                              equals: user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLToReviseIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        SubmittedReturnedIMERCCITLRevision: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        SubmittedReturnedIMERCCITLRevision: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCITLToReviseIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        SubmittedReturnedIMERCCITLRevision: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLToReviewIMs({
  skip,
  take,
  user,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  const statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          OR: [
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          ContentEditorReview: {
                            ContentEditorSuggestion: {
                              SubmittedContentEditorSuggestion: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          IDDSpecialistReview: {
                            IDDSpecialistSuggestion: {
                              SubmittedIDDSpecialistSuggestion: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    IDDSpecialistReview: {
                      IDDSpecialistSuggestion: {
                        SubmittedIDDSpecialistSuggestion: {
                          IDDSpecialistSuggestion: {
                            IDDSpecialistReview: {
                              IDDCoordinator: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentEditorReview: {
                      ContentEditorSuggestion: {
                        SubmittedContentEditorSuggestion: {
                          ContentEditorSuggestion: {
                            ContentEditorReview: {
                              CITLDirector: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          OR: [
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          ContentEditorReview: {
                            ContentEditorSuggestion: {
                              SubmittedContentEditorSuggestion: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          IDDSpecialistReview: {
                            IDDSpecialistSuggestion: {
                              SubmittedIDDSpecialistSuggestion: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    IDDSpecialistReview: {
                      IDDSpecialistSuggestion: {
                        SubmittedIDDSpecialistSuggestion: {
                          IDDSpecialistSuggestion: {
                            IDDSpecialistReview: {
                              IDDCoordinator: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentEditorReview: {
                      ContentEditorSuggestion: {
                        SubmittedContentEditorSuggestion: {
                          ContentEditorSuggestion: {
                            ContentEditorReview: {
                              CITLDirector: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCITLToReviewIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          OR: [
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          ContentEditorReview: {
                            ContentEditorSuggestion: {
                              SubmittedContentEditorSuggestion: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              NOT: {
                IMFile: {
                  some: {
                    QAMISRevision: {
                      QAMISChairpersonEndorsement: {
                        QAMISDepartmentEndorsement: {
                          IDDSpecialistReview: {
                            IDDSpecialistSuggestion: {
                              SubmittedIDDSpecialistSuggestion: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          ContentSpecialistSuggestion: {
                            ContentSpecialistReview: {
                              ContentSpecialist: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    IDDSpecialistReview: {
                      IDDSpecialistSuggestion: {
                        SubmittedIDDSpecialistSuggestion: {
                          IDDSpecialistSuggestion: {
                            IDDSpecialistReview: {
                              IDDCoordinator: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              QAMISRevision: {
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentEditorReview: {
                      ContentEditorSuggestion: {
                        SubmittedContentEditorSuggestion: {
                          ContentEditorSuggestion: {
                            ContentEditorReview: {
                              CITLDirector: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLToEndorseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  const statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                OR: [
                  {
                    ReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                OR: [
                  {
                    ReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
                IMERCIDDCoordinatorEndorsement: {
                  is: null,
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                OR: [
                  {
                    ReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                OR: [
                  {
                    ReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
                IMERCIDDCoordinatorEndorsement: {
                  is: null,
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });
  const result = { count, iMs };
  return result;
}

export async function countIMERCCITLToEndorseIMs() {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                OR: [
                  {
                    ReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              IMERCCITLRevision: {
                OR: [
                  {
                    ReturnedIMERCCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedIMERCCITLRevision: {
                      SubmittedReturnedIMERCCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
                IMERCIDDCoordinatorEndorsement: {
                  is: null,
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLReviewedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  const statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          OR: [
            {
              IMFile: {
                some: {
                  QAMISRevision: {
                    QAMISChairpersonEndorsement: {
                      QAMISDepartmentEndorsement: {
                        ContentEditorReview: {
                          ContentEditorSuggestion: {
                            SubmittedContentEditorSuggestion: {
                              ContentEditorSuggestion: {
                                ContentEditorReview: {
                                  CITLDirector: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  QAMISRevision: {
                    QAMISChairpersonEndorsement: {
                      QAMISDepartmentEndorsement: {
                        IDDSpecialistReview: {
                          IDDSpecialistSuggestion: {
                            SubmittedIDDSpecialistSuggestion: {
                              IDDSpecialistSuggestion: {
                                IDDSpecialistReview: {
                                  IDDCoordinator: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          OR: [
            {
              IMFile: {
                some: {
                  QAMISRevision: {
                    QAMISChairpersonEndorsement: {
                      QAMISDepartmentEndorsement: {
                        ContentEditorReview: {
                          ContentEditorSuggestion: {
                            SubmittedContentEditorSuggestion: {
                              ContentEditorSuggestion: {
                                ContentEditorReview: {
                                  CITLDirector: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  QAMISRevision: {
                    QAMISChairpersonEndorsement: {
                      QAMISDepartmentEndorsement: {
                        IDDSpecialistReview: {
                          IDDSpecialistSuggestion: {
                            SubmittedIDDSpecialistSuggestion: {
                              IDDSpecialistSuggestion: {
                                IDDSpecialistReview: {
                                  IDDCoordinator: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCITLReviewedIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          OR: [
            {
              IMFile: {
                some: {
                  QAMISRevision: {
                    QAMISChairpersonEndorsement: {
                      QAMISDepartmentEndorsement: {
                        ContentEditorReview: {
                          ContentEditorSuggestion: {
                            SubmittedContentEditorSuggestion: {
                              ContentEditorSuggestion: {
                                ContentEditorReview: {
                                  CITLDirector: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  QAMISRevision: {
                    QAMISChairpersonEndorsement: {
                      QAMISDepartmentEndorsement: {
                        IDDSpecialistReview: {
                          IDDSpecialistSuggestion: {
                            SubmittedIDDSpecialistSuggestion: {
                              IDDSpecialistSuggestion: {
                                IDDSpecialistReview: {
                                  IDDCoordinator: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLEndorsedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  const statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  IDDCoordinator: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  IDDCoordinator: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCITLEndorsedIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  IDDCoordinator: {
                                    User: {
                                      id: {
                                        equals: user.id,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLDirectorToEndorseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  const statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        SubmittedReturnedIMERCCITLRevision: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                  IMERCIDDCoordinatorEndorsement: {
                                    IMERCCITLDirectorEndorsement: {
                                      isNot: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        SubmittedReturnedIMERCCITLRevision: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                  IMERCIDDCoordinatorEndorsement: {
                                    IMERCCITLDirectorEndorsement: {
                                      isNot: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countIMERCCITLDirectorToEndorseIMs() {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                QAMISRevision: {
                  QAMISChairpersonEndorsement: {
                    QAMISDepartmentEndorsement: {
                      ContentSpecialistReview: {
                        ContentSpecialistSuggestion: {
                          SubmittedContentSpecialistSuggestion: {
                            IMERCCITLReviewed: {
                              IMERCCITLRevision: {
                                some: {
                                  OR: [
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                    {
                                      ReturnedIMERCCITLRevision: {
                                        SubmittedReturnedIMERCCITLRevision: {
                                          is: null,
                                        },
                                      },
                                    },
                                  ],
                                  IMERCIDDCoordinatorEndorsement: {
                                    IMERCCITLDirectorEndorsement: {
                                      isNot: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readIMERCCITLDirectorEndorsedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  const statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  IMERCCITLDirectorEndorsement: {
                                    CITLDirector: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  IMERCCITLDirectorEndorsement: {
                                    CITLDirector: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { iMs, count };
  return result;
}

export async function countIMERCCITLDirectorEndorsedIMs({
  user,
}: {
  user: User;
}) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  CITLDirectorEndorsement: {
                    QAMISSuggestion: {
                      SubmittedQAMISSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISCoordinatorEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
                QAMISDeanEndorsement: {
                  QAMISDepartmentEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              QAMISRevision: {
                QAMISChairpersonEndorsement: {
                  QAMISDepartmentEndorsement: {
                    ContentSpecialistReview: {
                      ContentSpecialistSuggestion: {
                        SubmittedContentSpecialistSuggestion: {
                          IMERCCITLReviewed: {
                            IMERCCITLRevision: {
                              some: {
                                OR: [
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      is: null,
                                    },
                                  },
                                  {
                                    ReturnedIMERCCITLRevision: {
                                      SubmittedReturnedIMERCCITLRevision: {
                                        is: null,
                                      },
                                    },
                                  },
                                ],
                                IMERCIDDCoordinatorEndorsement: {
                                  IMERCCITLDirectorEndorsement: {
                                    CITLDirector: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentToReviseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                CoordinatorReview: {
                  CoordinatorSuggestion: {
                    SubmittedCoordinatorSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                ChairpersonReview: {
                  ChairpersonSuggestion: {
                    SubmittedChairpersonSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                PeerReview: {
                  PeerSuggestion: {
                    SubmittedPeerSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                OR: [
                  {
                    ReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                CoordinatorReview: {
                  CoordinatorSuggestion: {
                    SubmittedCoordinatorSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                ChairpersonReview: {
                  ChairpersonSuggestion: {
                    SubmittedChairpersonSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                PeerReview: {
                  PeerSuggestion: {
                    SubmittedPeerSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                OR: [
                  {
                    ReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentToReviseIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  ReturnedDepartmentRevision: {
                    SubmittedReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                CoordinatorReview: {
                  CoordinatorSuggestion: {
                    SubmittedCoordinatorSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                ChairpersonReview: {
                  ChairpersonSuggestion: {
                    SubmittedChairpersonSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                PeerReview: {
                  PeerSuggestion: {
                    SubmittedPeerSuggestion: {
                      DepartmentReviewed: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              DepartmentRevision: {
                OR: [
                  {
                    ReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentToReviewIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          AND: [
            {
              OR: [
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              ActiveFaculty: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            PeerReview: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                    {
                      CoAuthor: {
                        none: {
                          Faculty: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      IMFile: {
                        some: {
                          DepartmentReview: {
                            PeerReview: {
                              Faculty: {
                                Department: {
                                  Faculty: {
                                    some: {
                                      ActiveFaculty: {
                                        Faculty: {
                                          User: {
                                            id: {
                                              equals: user.id,
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      CoAuthor: {
                        none: {
                          Faculty: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            PeerReview: {
                              PeerSuggestion: {
                                SubmittedPeerSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              Coordinator: {
                                ActiveCoordinator: {
                                  Coordinator: {
                                    Faculty: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            CoordinatorReview: {
                              CoordinatorSuggestion: {
                                SubmittedCoordinatorSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              Chairperson: {
                                ActiveChairperson: {
                                  Chairperson: {
                                    Faculty: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            ChairpersonReview: {
                              ChairpersonSuggestion: {
                                SubmittedChairpersonSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              IMFile: {
                none: {
                  DepartmentReview: {
                    CoordinatorReview: {
                      CoordinatorSuggestion: {
                        SubmittedCoordinatorSuggestion: {
                          DepartmentReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    isNot: null,
                  },
                },
              },
            },
          ],
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
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
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          AND: [
            {
              OR: [
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              ActiveFaculty: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            PeerReview: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                    {
                      CoAuthor: {
                        none: {
                          Faculty: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      IMFile: {
                        some: {
                          DepartmentReview: {
                            PeerReview: {
                              Faculty: {
                                Department: {
                                  Faculty: {
                                    some: {
                                      ActiveFaculty: {
                                        Faculty: {
                                          User: {
                                            id: {
                                              equals: user.id,
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      CoAuthor: {
                        none: {
                          Faculty: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            PeerReview: {
                              PeerSuggestion: {
                                SubmittedPeerSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              Coordinator: {
                                ActiveCoordinator: {
                                  Coordinator: {
                                    Faculty: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            CoordinatorReview: {
                              CoordinatorSuggestion: {
                                SubmittedCoordinatorSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              Chairperson: {
                                ActiveChairperson: {
                                  Chairperson: {
                                    Faculty: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            ChairpersonReview: {
                              ChairpersonSuggestion: {
                                SubmittedChairpersonSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              IMFile: {
                none: {
                  DepartmentReview: {
                    CoordinatorReview: {
                      CoordinatorSuggestion: {
                        SubmittedCoordinatorSuggestion: {
                          DepartmentReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    isNot: null,
                  },
                },
              },
            },
          ],
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentToReviewIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          AND: [
            {
              OR: [
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              ActiveFaculty: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            PeerReview: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                    {
                      CoAuthor: {
                        none: {
                          Faculty: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      IMFile: {
                        some: {
                          DepartmentReview: {
                            PeerReview: {
                              Faculty: {
                                Department: {
                                  Faculty: {
                                    some: {
                                      ActiveFaculty: {
                                        Faculty: {
                                          User: {
                                            id: {
                                              equals: user.id,
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      CoAuthor: {
                        none: {
                          Faculty: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            PeerReview: {
                              PeerSuggestion: {
                                SubmittedPeerSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              Coordinator: {
                                ActiveCoordinator: {
                                  Coordinator: {
                                    Faculty: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            CoordinatorReview: {
                              CoordinatorSuggestion: {
                                SubmittedCoordinatorSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      Faculty: {
                        Department: {
                          Faculty: {
                            some: {
                              Chairperson: {
                                ActiveChairperson: {
                                  Chairperson: {
                                    Faculty: {
                                      User: {
                                        id: {
                                          equals: user.id,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    {
                      IMFile: {
                        none: {
                          DepartmentReview: {
                            ChairpersonReview: {
                              ChairpersonSuggestion: {
                                SubmittedChairpersonSuggestion: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              IMFile: {
                none: {
                  DepartmentReview: {
                    CoordinatorReview: {
                      CoordinatorSuggestion: {
                        SubmittedCoordinatorSuggestion: {
                          DepartmentReviewed: {
                            isNot: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    isNot: null,
                  },
                },
              },
            },
          ],
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentToEndorseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          id: userActiveFaculty.facultyId,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                OR: [
                  {
                    ReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                OR: [
                  {
                    ReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentToEndorseIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          id: userActiveFaculty.facultyId,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                OR: [
                  {
                    ReturnedDepartmentRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedDepartmentRevision: {
                      SubmittedReturnedDepartmentRevision: null,
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentReviewedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          OR: [
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    CoordinatorReview: {
                      CoordinatorSuggestion: {
                        SubmittedCoordinatorSuggestion: {
                          CoordinatorSuggestion: {
                            CoordinatorReview: {
                              Coordinator: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    ChairpersonReview: {
                      ChairpersonSuggestion: {
                        SubmittedChairpersonSuggestion: {
                          ChairpersonSuggestion: {
                            ChairpersonReview: {
                              Chairperson: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    PeerReview: {
                      PeerSuggestion: {
                        SubmittedPeerSuggestion: {
                          PeerSuggestion: {
                            PeerReview: {
                              Faculty: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          OR: [
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    CoordinatorReview: {
                      CoordinatorSuggestion: {
                        SubmittedCoordinatorSuggestion: {
                          CoordinatorSuggestion: {
                            CoordinatorReview: {
                              Coordinator: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    ChairpersonReview: {
                      ChairpersonSuggestion: {
                        SubmittedChairpersonSuggestion: {
                          ChairpersonSuggestion: {
                            ChairpersonReview: {
                              Chairperson: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    PeerReview: {
                      PeerSuggestion: {
                        SubmittedPeerSuggestion: {
                          PeerSuggestion: {
                            PeerReview: {
                              Faculty: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentReviewedIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          OR: [
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    CoordinatorReview: {
                      CoordinatorSuggestion: {
                        SubmittedCoordinatorSuggestion: {
                          CoordinatorSuggestion: {
                            CoordinatorReview: {
                              Coordinator: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    ChairpersonReview: {
                      ChairpersonSuggestion: {
                        SubmittedChairpersonSuggestion: {
                          ChairpersonSuggestion: {
                            ChairpersonReview: {
                              Chairperson: {
                                Faculty: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              IMFile: {
                some: {
                  DepartmentReview: {
                    PeerReview: {
                      PeerSuggestion: {
                        SubmittedPeerSuggestion: {
                          PeerSuggestion: {
                            PeerReview: {
                              Faculty: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  });
  return count;
}

export async function readMyIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            User: {
              id: {
                equals: user.id,
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            User: {
              id: {
                equals: user.id,
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countMyIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            User: {
              id: {
                equals: user.id,
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentEndorsedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  Coordinator: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  Coordinator: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentEndorsedIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  Coordinator: {
                    Faculty: {
                      User: {
                        id: {
                          equals: user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentCoAuthoredIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          CoAuthor: {
            some: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {

      AND: [
        statusQuery,
        {
          CoAuthor: {
            some: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentCoAuthoredIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          CoAuthor: {
            some: {
              Faculty: {
                User: {
                  id: {
                    equals: user.id,
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readDepartmentIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          id: userActiveFaculty.facultyId,
        },
      },
    },
  });
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countDepartmentIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          id: userActiveFaculty.facultyId,
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              id: {
                equals: department.id,
              },
            },
          },
        },
      ],
    },
  });
  return count;
}
export async function countIMs(
  filterStart: Date | undefined,
  filterEnd: Date | undefined,
  filterStatus: string | undefined,
  filterDepartmentId: string | undefined,
  filterCollegeId: string | undefined
) {
  let startWhere: Prisma.IMWhereInput = {
    createdAt: {
      gte: filterStart,
    },
  };
  let endWhere: Prisma.IMWhereInput = {
    createdAt: {
      lte: filterEnd,
    },
  };
  let statusWhere = iMStatusQueryBuilder(filterStatus);

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              id: {
                contains: filterDepartmentId ?? "",
              },
            },
          },
        },
        {
          Faculty: {
            Department: {
              College: {
                id: {
                  contains: filterCollegeId ?? "",
                },
              },
            },
          },
        },
        statusWhere,
        startWhere,
        endWhere,
      ],
    },
  });
  return count;
}

export async function readCollegeToEndorseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: userActiveFaculty.id,
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      isNot: null,
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      isNot: null,
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCollegeToEndorseIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: userActiveFaculty.id,
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      isNot: null,
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCollegeEndorsedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            Faculty: {
              User: {
                id: {
                  equals: user.id,
                },
              },
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    Dean: {
                      Faculty: {
                        User: {
                          id: {
                            equals: user.id,
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentReview: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    Dean: {
                      Faculty: {
                        User: {
                          id: {
                            equals: user.id,
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCollegeEndorsedIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            Faculty: {
              User: {
                id: {
                  equals: user.id,
                },
              },
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                isNot: null,
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    Dean: {
                      Faculty: {
                        User: {
                          id: {
                            equals: user.id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCollegeIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: userActiveFaculty.id,
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCollegeIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const userActiveDean = await prisma.activeDean.findFirstOrThrow({
    where: {
      Dean: {
        Faculty: {
          ActiveFaculty: {
            id: {
              equals: userActiveFaculty.id,
            },
          },
        },
      },
    },
    include: {
      Dean: {
        include: {
          Faculty: {
            include: {
              Department: {
                include: {
                  College: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            Department: {
              College: {
                id: userActiveDean.Dean.Faculty.Department.College.id,
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLToReviseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });

  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                CITLRevision: {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              CITLRevision: {
                OR: [
                  {
                    ReturnedCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                CITLRevision: {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              CITLRevision: {
                OR: [
                  {
                    ReturnedCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCITLToReviseIMs({ user }: { user: User }) {
  let userActiveFaculty: ActiveFaculty;
  userActiveFaculty = await prisma.activeFaculty.findFirstOrThrow({
    where: {
      Faculty: {
        userId: {
          equals: user.id,
        },
      },
    },
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          Faculty: {
            id: {
              equals: userActiveFaculty.facultyId,
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        isNot: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                CITLRevision: {
                  ReturnedCITLRevision: {
                    SubmittedReturnedCITLRevision: {
                      is: null,
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              CITLRevision: {
                IDDCoordinatorEndorsement: {
                  isNot: null,
                },
              },
            },
          },
        },
        {
          IMFile: {
            none: {
              CITLRevision: {
                OR: [
                  {
                    ReturnedCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLToReviewIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
}: {
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          isNot: null,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          isNot: null,
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCITLToReviewIMs() {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          isNot: null,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLToEndorseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                OR: [
                  {
                    ReturnedCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                isNot: null,
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                OR: [
                  {
                    ReturnedCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                isNot: null,
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { iMs, count };
  return result;
}

export async function countCITLToEndorseIMs() {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              CITLRevision: {
                OR: [
                  {
                    ReturnedCITLRevision: {
                      is: null,
                    },
                  },
                  {
                    ReturnedCITLRevision: {
                      SubmittedReturnedCITLRevision: {
                        is: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                isNot: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLReviewedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        IDDCoordinatorSuggestion: {
                          IDDCoordinator: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        IDDCoordinatorSuggestion: {
                          IDDCoordinator: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCITLReviewedIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        IDDCoordinatorSuggestion: {
                          IDDCoordinator: {
                            User: {
                              id: {
                                equals: user.id,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLEndorsedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };
  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              IDDCoordinator: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              IDDCoordinator: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { iMs, count };
  return result;
}

export async function countCITLEndorsedIMs({ user }: { user: User }) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              IDDCoordinator: {
                                User: {
                                  id: {
                                    equals: user.id,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLCITLDirectorToEndorseIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                CITLDirectorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                CITLDirectorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCITLCITLDirectorToEndorseIMs() {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          NOT: {
            IMFile: {
              some: {
                DepartmentRevision: {
                  CoordinatorEndorsement: {
                    DeanEndorsement: {
                      IDDCoordinatorSuggestion: {
                        SubmittedIDDCoordinatorSuggestion: {
                          CITLRevision: {
                            some: {
                              IDDCoordinatorEndorsement: {
                                CITLDirectorEndorsement: {
                                  isNot: null,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLCITLDirectorEndorsedIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              CITLDirectorEndorsement: {
                                CITLDirector: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              CITLDirectorEndorsement: {
                                CITLDirector: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
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
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { count, iMs };
  return result;
}

export async function countCITLCITLDirectorEndorsedIMs({
  user,
}: {
  user: User;
}) {
  const count = await prisma.iM.count({
    where: {
      AND: [
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    isNot: null,
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              isNot: null,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          IMFile: {
            some: {
              DepartmentRevision: {
                CoordinatorEndorsement: {
                  DeanEndorsement: {
                    IDDCoordinatorSuggestion: {
                      SubmittedIDDCoordinatorSuggestion: {
                        CITLRevision: {
                          some: {
                            IDDCoordinatorEndorsement: {
                              CITLDirectorEndorsement: {
                                CITLDirector: {
                                  User: {
                                    id: {
                                      equals: user.id,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  return count;
}

export async function readCITLIMs({
  skip,
  take,
  filterCollegeName,
  filterDepartmentName,
  filterStatus,
  filterTitle,
  filterUserName,
  sortDirection,
  sortField,
  user,
}: {
  user: User;
  filterStatus?: string;
  sortField?: string;
  sortDirection?: Prisma.SortOrder;
  skip: number;
  take: number;
  filterUserName?: string;
  filterTitle?: string;
  filterDepartmentName?: string;
  filterCollegeName?: string;
}) {
  let statusQuery = iMStatusQueryBuilder(filterStatus);

  const orderBy: Prisma.IMOrderByWithRelationInput =
    sortField === "title"
      ? {
        title: sortDirection,
      }
      : sortField === "createdAt"
        ? {
          createdAt: sortDirection,
        }
        : sortField === "userName"
          ? {
            Faculty: {
              User: {
                name: sortDirection,
              },
            },
          }
          : sortField === "departmentName"
            ? {
              Faculty: {
                Department: {
                  name: sortDirection,
                },
              },
            }
            : sortField === "collegeName"
              ? {
                Faculty: {
                  Department: {
                    College: {
                      name: sortDirection,
                    },
                  },
                },
              }
              : {
                createdAt: "desc",
              };

  const iMs = await prisma.iM.findMany({
    skip,
    take,
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
    orderBy,
  });
  const count = await prisma.iM.count({
    where: {
      AND: [
        statusQuery,
        {
          Faculty: {
            User: {
              name: {
                contains: filterUserName ?? "",
                mode: "insensitive",
              },
            },
          },
        },
        {
          title: {
            contains: filterTitle ?? "",
            mode: "insensitive",
          },
        },
        {
          Faculty: {
            Department: {
              name: {
                contains: filterDepartmentName ?? "",
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
                  contains: filterCollegeName ?? "",
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ],
    },
  });

  const result = { iMs, count };
  return result;
}

export async function countCITLIMs() {
  const count = await prisma.iM.count({
    where: {},
  });
  return count;
}

export async function readIM({ id }: { id: string }) {
  const iM = await prisma.iM.findFirstOrThrow({
    where: {
      AND: [
        {
          id: {
            equals: id,
          },
        },
      ],
    },
  });

  return iM;
}

export async function deleteIM({ user, id }: { user: User; id: string }) {
  const iMToDelete = await prisma.iM.findFirstOrThrow({
    where: {
      id: {
        equals: id as string,
      },
    },
  });

  const departmentReview = await prisma.departmentReview.findFirst({
    where: {
      IMFile: {
        IM: {
          id: {
            equals: id as string,
          },
        },
      },
    },
  });

  if (departmentReview && !user.isAdmin) {
    throw new Error("Cannot delete IMs submitted for review.");
  }

  if (!user.isAdmin) {
    const faculty = await prisma.faculty.findFirst({
      where: {
        ActiveFaculty: {
          Faculty: {
            User: {
              id: {
                equals: user.id as string,
              },
            },
          },
        },
      },
    });
    if (!faculty) {
      throw new Error("You must be an active faculty to perform this action");
    }
    if (faculty?.id !== iMToDelete.facultyId) {
      throw new Error("You cannot delete this IM");
    }
  }

  const iM = await prisma.iM.delete({
    where: {
      id: id as string,
    },
  });

  return iM;
}

export async function updateIM({
  id,
  title,
  type,
  user,
}: {
  user: User;
  id: string;
  title: string;
  type: IMType;
}) {
  if (!user.isAdmin) {
    const iMOwner = await prisma.faculty.findFirst({
      where: {
        IM: {
          some: {
            Faculty: {
              ActiveFaculty: {
                Faculty: {
                  IM: {
                    some: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (iMOwner?.userId !== user.id) {
      throw new Error("You are not allowed to update this IM");
    }

    const departmentReview = await prisma.departmentReview.findFirst({
      where: {
        IMFile: {
          IM: {
            id: {
              equals: id as string,
            },
          },
        },
      },
    });
    if (departmentReview) {
      throw new Error("Cannot update IMs submitted for review");
    }
  }

  const iM = await prisma.iM.update({
    where: {
      id: id as string,
    },
    data: {
      title,
      type,
    },
  });

  return iM;
}

export async function readIMStatus({ id }: { id: string }) {
  const departmentReview = await prisma.departmentReview.findFirst({
    where: {
      IMFile: {
        IM: {
          id: {
            equals: id,
          },
        },
      },
    },
  });

  const departmentReviewed = await prisma.departmentReviewed.findFirst({
    where: {
      AND: [
        {
          SubmittedCoordinatorSuggestion: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  const departmentRevision = await prisma.departmentRevision.findFirst({
    where: {
      AND: [
        {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      ],
    },
  });

  const submittedReturnedDepartmentRevision =
    await prisma.submittedReturnedDepartmentRevision.findFirst({
      where: {
        AND: [
          {
            ReturnedDepartmentRevision: {
              DepartmentRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
          {
            IMFile: {
              is: null,
            },
          },
        ],
      },
    });

  const coordinatorEndorsement = await prisma.coordinatorEndorsement.findFirst({
    where: {
      DepartmentRevision: {
        IMFile: {
          IM: {
            id: {
              equals: id,
            },
          },
        },
      },
    },
  });

  const deanEndorsement = await prisma.deanEndorsement.findFirst({
    where: {
      CoordinatorEndorsement: {
        DepartmentRevision: {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    },
  });

  const submittedIDDCoordinatorSuggestion =
    await prisma.submittedIDDCoordinatorSuggestion.findFirst({
      where: {
        IDDCoordinatorSuggestion: {
          DeanEndorsement: {
            CoordinatorEndorsement: {
              DepartmentRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

  const cITLRevision = await prisma.cITLRevision.findFirst({
    where: {
      AND: [
        {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      ],
    },
  });

  const submittedReturnedCITLRevision =
    await prisma.submittedReturnedCITLRevision.findFirst({
      where: {
        AND: [
          {
            ReturnedCITLRevision: {
              CITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
          {
            IMFile: {
              is: null,
            },
          },
        ],
      },
    });

  const iDDCoordinatorEndorsement =
    await prisma.iDDCoordinatorEndorsement.findFirst({
      where: {
        CITLRevision: {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    });

  const cITLDirectorEndorsement =
    await prisma.cITLDirectorEndorsement.findFirst({
      where: {
        IDDCoordinatorEndorsement: {
          CITLRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  const qAMISRevision = await prisma.qAMISRevision.findFirst({
    where: {
      SubmittedQAMISSuggestion: {
        QAMISSuggestion: {
          CITLDirectorEndorsement: {
            IDDCoordinatorEndorsement: {
              CITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const qAMISDepartmentEndorsement =
    await prisma.qAMISDepartmentEndorsement.findFirst({
      where: {
        AND: [
          {
            QAMISDeanEndorsement: {
              QAMISRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });

  const iMERCCITLReviewed = await prisma.iMERCCITLReviewed.findFirst({
    where: {
      AND: [
        {
          SubmittedContentEditorSuggestion: {
            ContentEditorSuggestion: {
              ContentEditorReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  const iMERCCITLRevision = await prisma.iMERCCITLRevision.findFirst({
    where: {
      IMFile: {
        IM: {
          id: { equals: id },
        },
      },
    },
  });

  const submittedReturnedIMERCCITLRevision =
    await prisma.submittedReturnedIMERCCITLRevision.findFirst({
      where: {
        AND: [
          {
            ReturnedIMERCCITLRevision: {
              IMERCCITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id,
                    },
                  },
                },
              },
            },
          },
          {
            IMFile: {
              is: null,
            },
          },
        ],
      },
    });

  const iMERCIDDCoordinatorEndorsement =
    await prisma.iMERCIDDCoordinatorEndorsement.findFirst({
      where: {
        IMERCCITLRevision: {
          IMFile: {
            IM: {
              id: {
                equals: id,
              },
            },
          },
        },
      },
    });

  const iMERCCITLDirectorEndorsement =
    await prisma.iMERCCITLDirectorEndorsement.findFirst({
      where: {
        IMERCIDDCoordinatorEndorsement: {
          IMERCCITLRevision: {
            IMFile: {
              IM: {
                id: {
                  equals: id,
                },
              },
            },
          },
        },
      },
    });

  if (iMERCCITLDirectorEndorsement) {
    return "IMERC_CITL_DIRECTOR_ENDORSED";
  } else if (iMERCIDDCoordinatorEndorsement) {
    return "IMERC_CITL_IDD_COORDINATOR_ENDORSED";
  } else if (submittedReturnedIMERCCITLRevision) {
    return "IMERC_CITL_RETURNED_REVISION";
  } else if (iMERCCITLRevision) {
    return "IMERC_CITL_REVISED";
  } else if (iMERCCITLReviewed) {
    return "IMERC_CITL_REVIEWED";
  } else if (qAMISDepartmentEndorsement) {
    return "IMERC_QAMIS_DEPARTMENT_ENDORSED";
  } else if (qAMISRevision) {
    return "IMERC_QAMIS_REVISED";
  } else if (cITLDirectorEndorsement) {
    return "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED";
  } else if (iDDCoordinatorEndorsement) {
    return "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED";
  } else if (submittedReturnedCITLRevision) {
    return "IMPLEMENTATION_CITL_RETURNED_REVISION";
  } else if (cITLRevision) {
    return "IMPLEMENTATION_CITL_REVISED";
  } else if (submittedIDDCoordinatorSuggestion) {
    return "IMPLEMENTATION_CITL_REVIEWED";
  } else if (deanEndorsement) {
    return "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED";
  } else if (coordinatorEndorsement) {
    return "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED";
  } else if (submittedReturnedDepartmentRevision) {
    return "IMPLEMENTATION_DEPARTMENT_RETURNED_REVISION";
  } else if (departmentRevision) {
    return "IMPLEMENTATION_DEPARTMENT_REVISED";
  } else if (departmentReviewed) {
    return "IMPLEMENTATION_DEPARTMENT_REVIEWED";
  } else if (departmentReview) {
    return "IMPLEMENTATION_DEPARTMENT_REVIEW";
  } else {
    return "IMPLEMENTATION_DRAFT";
  }
}

export async function readIMF015({ id }: { id: string }) {
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Coordinator: {
            AND: [
              {
                ActiveCoordinator: {
                  isNot: null,
                },
              },
              {
                Faculty: {
                  Department: {
                    id: {
                      equals: department.id,
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  });

  const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      IDDCoordinator: {
        IDDCoordinatorSuggestion: {
          some: {
            SubmittedIDDCoordinatorSuggestion: {
              IDDCoordinatorSuggestion: {
                DeanEndorsement: {
                  CoordinatorEndorsement: {
                    DepartmentRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const qAMISReview: F015Suggestion[] = [];
  const qAMISSuggestionItems = await prisma.qAMISSuggestionItem.findMany({
    where: {
      QAMISSuggestion: {
        SubmittedQAMISSuggestion: {
          QAMISSuggestion: {
            CITLDirectorEndorsement: {
              IDDCoordinatorEndorsement: {
                CITLRevision: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  for (let qAMISSuggestionItem of qAMISSuggestionItems) {
    qAMISReview.push({
      actionTaken: qAMISSuggestionItem.actionTaken ?? "",
      pageNumber: qAMISSuggestionItem.pageNumber,
      remarks: qAMISSuggestionItem.remarks ?? "",
      suggestion: qAMISSuggestionItem.suggestion,
    });
  }

  const iMERCReview: F015Suggestion[] = [];
  const contentSpecialistSuggestionItems =
    await prisma.contentSpecialistSuggestionItem.findMany({
      where: {
        ContentSpecialistSuggestion: {
          SubmittedContentSpecialistSuggestion: {
            ContentSpecialistSuggestion: {
              ContentSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let contentSpecialistSuggestionItem of contentSpecialistSuggestionItems) {
    const actionTaken =
      await prisma.contentSpecialistSuggestionItemActionTaken.findFirst({
        where: {
          ContentSpecialistSuggestionItem: {
            id: {
              equals: contentSpecialistSuggestionItem.id,
            },
          },
        },
      });
    iMERCReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: contentSpecialistSuggestionItem.pageNumber,
      remarks: contentSpecialistSuggestionItem.remarks ?? "",
      suggestion: contentSpecialistSuggestionItem.suggestion,
    });
  }
  const iDDSpecialistSuggestionItems =
    await prisma.iDDSpecialistSuggestionItem.findMany({
      where: {
        IDDSpecialistSuggestion: {
          SubmittedIDDSpecialistSuggestion: {
            IDDSpecialistSuggestion: {
              IDDSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let iDDSpecialistSuggestionItem of iDDSpecialistSuggestionItems) {
    const actionTaken =
      await prisma.iDDSpecialistSuggestionItemActionTaken.findFirst({
        where: {
          IDDSpecialistSuggestionItem: {
            id: {
              equals: iDDSpecialistSuggestionItem.id,
            },
          },
        },
      });
    iMERCReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: iDDSpecialistSuggestionItem.pageNumber,
      remarks: iDDSpecialistSuggestionItem.remarks ?? "",
      suggestion: iDDSpecialistSuggestionItem.suggestion,
    });
  }

  const contentEditorSuggestionItems =
    await prisma.contentEditorSuggestionItem.findMany({
      where: {
        ContentEditorSuggestion: {
          SubmittedContentEditorSuggestion: {
            ContentEditorSuggestion: {
              ContentEditorReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let contentEditorSuggestionItem of contentEditorSuggestionItems) {
    const actionTaken =
      await prisma.contentEditorSuggestionItemActionTaken.findFirst({
        where: {
          ContentEditorSuggestionItem: {
            id: {
              equals: contentEditorSuggestionItem.id,
            },
          },
        },
      });
    iMERCReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: contentEditorSuggestionItem.pageNumber,
      remarks: contentEditorSuggestionItem.remarks ?? "",
      suggestion: contentEditorSuggestionItem.suggestion,
    });
  }

  const returnedIMERCCITLRevisionSuggestionItems =
    await prisma.returnedIMERCCITLRevisionSuggestionItem.findMany({
      where: {
        ReturnedIMERCCITLRevision: {
          SubmittedReturnedIMERCCITLRevision: {
            ReturnedIMERCCITLRevision: {
              IMERCCITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let returnedIMERCCITLRevisionSuggestionItem of returnedIMERCCITLRevisionSuggestionItems) {
    const actionTaken =
      await prisma.returnedCITLRevisionSuggestionItemActionTaken.findFirst({
        where: {
          ReturnedCITLRevisionSuggestionItem: {
            id: {
              equals: returnedIMERCCITLRevisionSuggestionItem.id,
            },
          },
        },
      });
    iMERCReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: returnedIMERCCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedIMERCCITLRevisionSuggestionItem.remarks ?? "",
      suggestion: returnedIMERCCITLRevisionSuggestionItem.suggestion,
    });
  }

  const response: F015Props = {
    iMTitle: iM.title,
    coordinatorName: coordinatorUser.name ?? "",
    iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
    authorName: iMAuthor.name ?? "",
    iMERCReview,
    programName: department.name,
    qAMISReview,
  };

  return response;
}

export async function readIMF014({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };

  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const contentEditorReview = await prisma.contentEditorReview.findFirstOrThrow(
    {
      where: {
        ContentEditorSuggestion: {
          SubmittedContentEditorSuggestion: {
            ContentEditorSuggestion: {
              ContentEditorReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
  const cITLDirectorUser = await prisma.user.findFirstOrThrow({
    where: {
      CITLDirector: {
        id: contentEditorReview.cITLDirectorId,
      },
    },
  });
  const contentEditorRatings = [
    [contentEditorReview.q1_1, contentEditorReview.q1_2],
    [
      contentEditorReview.q2_1,
      contentEditorReview.q2_2,
      contentEditorReview.q2_3,
      contentEditorReview.q2_4,
    ],
    [contentEditorReview.q3_1],
    [
      contentEditorReview.q4_1,
      contentEditorReview.q4_2,
      contentEditorReview.q4_3,
    ],
    [
      contentEditorReview.q5_1,
      contentEditorReview.q5_2,
      contentEditorReview.q5_3,
      contentEditorReview.q5_4,
    ],
    [
      contentEditorReview.q6_1,
      contentEditorReview.q6_2,
      contentEditorReview.q6_3,
      contentEditorReview.q6_4,
      contentEditorReview.q6_5,
    ],
    [
      contentEditorReview.q7_1,
      contentEditorReview.q7_2,
      contentEditorReview.q7_3,
      contentEditorReview.q7_4,
      contentEditorReview.q7_5,
    ],
    [
      contentEditorReview.q8_1,
      contentEditorReview.q8_2,
      contentEditorReview.q8_3,
    ],
  ];

  const iDDSpecialistReview = await prisma.iDDSpecialistReview.findFirstOrThrow(
    {
      where: {
        IDDSpecialistSuggestion: {
          SubmittedIDDSpecialistSuggestion: {
            IDDSpecialistSuggestion: {
              IDDSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
  );
  const iDDCoordinator = await prisma.user.findFirstOrThrow({
    where: {
      IDDCoordinator: {
        id: {
          equals: iDDSpecialistReview.iDDCoordinatorId,
        },
      },
    },
  });
  const iDDSpecialistRatings = [
    [iDDSpecialistReview.q1_1, iDDSpecialistReview.q1_2],
    [
      iDDSpecialistReview.q2_1,
      iDDSpecialistReview.q2_2,
      iDDSpecialistReview.q2_3,
      iDDSpecialistReview.q2_4,
    ],
    [iDDSpecialistReview.q3_1],
    [
      iDDSpecialistReview.q4_1,
      iDDSpecialistReview.q4_2,
      iDDSpecialistReview.q4_3,
    ],
    [
      iDDSpecialistReview.q5_1,
      iDDSpecialistReview.q5_2,
      iDDSpecialistReview.q5_3,
      iDDSpecialistReview.q5_4,
    ],
    [
      iDDSpecialistReview.q6_1,
      iDDSpecialistReview.q6_2,
      iDDSpecialistReview.q6_3,
      iDDSpecialistReview.q6_4,
      iDDSpecialistReview.q6_5,
    ],
    [
      iDDSpecialistReview.q7_1,
      iDDSpecialistReview.q7_2,
      iDDSpecialistReview.q7_3,
      iDDSpecialistReview.q7_4,
      iDDSpecialistReview.q7_5,
    ],
    [
      iDDSpecialistReview.q8_1,
      iDDSpecialistReview.q8_2,
      iDDSpecialistReview.q8_3,
    ],
  ];

  const contentSpecialistReview =
    await prisma.contentSpecialistReview.findFirstOrThrow({
      where: {
        ContentSpecialistSuggestion: {
          SubmittedContentSpecialistSuggestion: {
            ContentSpecialistSuggestion: {
              ContentSpecialistReview: {
                QAMISDepartmentEndorsement: {
                  QAMISDeanEndorsement: {
                    QAMISRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  const contentSpecialistUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          ContentSpecialist: {
            id: {
              equals: contentSpecialistReview.contentSpecialistId,
            },
          },
        },
      },
    },
  });
  const contentSpecialistRatings = [
    [contentSpecialistReview.q1_1, contentSpecialistReview.q1_2],
    [
      contentSpecialistReview.q2_1,
      contentSpecialistReview.q2_2,
      contentSpecialistReview.q2_3,
      contentSpecialistReview.q2_4,
    ],
    [contentSpecialistReview.q3_1],
    [
      contentSpecialistReview.q4_1,
      contentSpecialistReview.q4_2,
      contentSpecialistReview.q4_3,
    ],
    [
      contentSpecialistReview.q5_1,
      contentSpecialistReview.q5_2,
      contentSpecialistReview.q5_3,
      contentSpecialistReview.q5_4,
    ],
    [
      contentSpecialistReview.q6_1,
      contentSpecialistReview.q6_2,
      contentSpecialistReview.q6_3,
      contentSpecialistReview.q6_4,
      contentSpecialistReview.q6_5,
    ],
    [
      contentSpecialistReview.q7_1,
      contentSpecialistReview.q7_2,
      contentSpecialistReview.q7_3,
      contentSpecialistReview.q7_4,
      contentSpecialistReview.q7_5,
    ],
    [
      contentSpecialistReview.q8_1,
      contentSpecialistReview.q8_2,
      contentSpecialistReview.q8_3,
    ],
  ];

  const response: F014Props = {
    iMTitle: iM?.title,
    authorNames: authorNames.join(", "),
    iMType: iMTypeMap[iM.type] as
      | "Module"
      | "Course File"
      | "Worktext"
      | "Textbook",
    cITLDirectorName: cITLDirectorUser.name ?? "",
    contentEditorRatings,
    contentSpecialistName: contentSpecialistUser.name ?? "",
    contentSpecialistRatings,
    iDDCoordinatorName: iDDCoordinator.name ?? "",
    iDDSpecialistRatings,
  };

  return response;
}

export async function readIMF013({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Coordinator: {
            CoordinatorReview: {
              some: {
                CoordinatorSuggestion: {
                  SubmittedCoordinatorSuggestion: {
                    CoordinatorSuggestion: {
                      CoordinatorReview: {
                        DepartmentReview: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const chairpersonUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Chairperson: {
            ChairpersonReview: {
              some: {
                ChairpersonSuggestion: {
                  SubmittedChairpersonSuggestion: {
                    ChairpersonSuggestion: {
                      ChairpersonReview: {
                        DepartmentReview: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const peerUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          PeerReview: {
            some: {
              PeerSuggestion: {
                SubmittedPeerSuggestion: {
                  PeerSuggestion: {
                    PeerReview: {
                      DepartmentReview: {
                        IMFile: {
                          IM: {
                            id: {
                              equals: id as string,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const peerReview = await prisma.peerReview.findFirstOrThrow({
    where: {
      PeerSuggestion: {
        SubmittedPeerSuggestion: {
          PeerSuggestion: {
            PeerReview: {
              DepartmentReview: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const coordinatorReview = await prisma.coordinatorReview.findFirstOrThrow({
    where: {
      CoordinatorSuggestion: {
        SubmittedCoordinatorSuggestion: {
          CoordinatorSuggestion: {
            CoordinatorReview: {
              DepartmentReview: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const chairpersonReview = await prisma.chairpersonReview.findFirstOrThrow({
    where: {
      ChairpersonSuggestion: {
        SubmittedChairpersonSuggestion: {
          ChairpersonSuggestion: {
            ChairpersonReview: {
              DepartmentReview: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const ratingToNumber = (rating?: Rating | null) => {
    switch (rating) {
      case "NAA":
        return 1;
      case "NM":
        return 2;
      case "JE":
        return 3;
      case "M":
        return 4;
      case "VM":
        return 5;
      default:
        return 0;
    }
  };

  const numberToRating = (num: number): "VM" | "M" | "JE" | "NM" | "NAA" => {
    switch (num) {
      case 1:
        return "NAA";
      case 2:
        return "NM";
      case 3:
        return "JE";
      case 4:
        return "M";
      case 5:
        return "VM";
      default:
        return "NAA";
    }
  };

  const ratings: ("VM" | "M" | "JE" | "NM" | "NAA")[][] = [
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q1_1) +
            ratingToNumber(chairpersonReview.q1_1) +
            ratingToNumber(coordinatorReview.q1_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q1_2) +
            ratingToNumber(chairpersonReview.q1_2) +
            ratingToNumber(coordinatorReview.q1_2)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q2_1) +
            ratingToNumber(chairpersonReview.q2_1) +
            ratingToNumber(coordinatorReview.q2_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q2_2) +
            ratingToNumber(chairpersonReview.q2_2) +
            ratingToNumber(coordinatorReview.q2_2)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q2_3) +
            ratingToNumber(chairpersonReview.q2_3) +
            ratingToNumber(coordinatorReview.q2_3)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q2_4) +
            ratingToNumber(chairpersonReview.q2_4) +
            ratingToNumber(coordinatorReview.q2_4)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q3_1) +
            ratingToNumber(chairpersonReview.q3_1) +
            ratingToNumber(coordinatorReview.q3_1)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q4_1) +
            ratingToNumber(chairpersonReview.q4_1) +
            ratingToNumber(coordinatorReview.q4_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q4_2) +
            ratingToNumber(chairpersonReview.q4_2) +
            ratingToNumber(coordinatorReview.q4_2)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q4_3) +
            ratingToNumber(chairpersonReview.q4_3) +
            ratingToNumber(coordinatorReview.q4_3)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q5_1) +
            ratingToNumber(chairpersonReview.q5_1) +
            ratingToNumber(coordinatorReview.q5_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q5_2) +
            ratingToNumber(chairpersonReview.q5_2) +
            ratingToNumber(coordinatorReview.q5_2)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q5_3) +
            ratingToNumber(chairpersonReview.q5_3) +
            ratingToNumber(coordinatorReview.q5_3)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q6_1) +
            ratingToNumber(chairpersonReview.q6_1) +
            ratingToNumber(coordinatorReview.q6_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q6_2) +
            ratingToNumber(chairpersonReview.q6_2) +
            ratingToNumber(coordinatorReview.q6_2)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q6_3) +
            ratingToNumber(chairpersonReview.q6_3) +
            ratingToNumber(coordinatorReview.q6_3)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q6_4) +
            ratingToNumber(chairpersonReview.q6_4) +
            ratingToNumber(coordinatorReview.q6_4)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q6_5) +
            ratingToNumber(chairpersonReview.q6_5) +
            ratingToNumber(coordinatorReview.q6_5)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q7_1) +
            ratingToNumber(chairpersonReview.q7_1) +
            ratingToNumber(coordinatorReview.q7_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q7_2) +
            ratingToNumber(chairpersonReview.q7_2) +
            ratingToNumber(coordinatorReview.q7_2)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q7_3) +
            ratingToNumber(chairpersonReview.q7_3) +
            ratingToNumber(coordinatorReview.q7_3)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q7_4) +
            ratingToNumber(chairpersonReview.q7_4) +
            ratingToNumber(coordinatorReview.q7_4)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q7_5) +
            ratingToNumber(chairpersonReview.q7_5) +
            ratingToNumber(coordinatorReview.q7_5)) /
          3
        )
      ),
    ],
    [
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q8_1) +
            ratingToNumber(chairpersonReview.q8_1) +
            ratingToNumber(coordinatorReview.q8_1)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q8_2) +
            ratingToNumber(chairpersonReview.q8_2) +
            ratingToNumber(coordinatorReview.q8_2)) /
          3
        )
      ),
      numberToRating(
        Math.round(
          (ratingToNumber(peerReview.q8_3) +
            ratingToNumber(chairpersonReview.q8_3) +
            ratingToNumber(coordinatorReview.q8_3)) /
          3
        )
      ),
    ],
  ];

  const response: F013Props = {
    iMTitle: iM?.title,
    authorNames: authorNames.join(", "),
    iMType: iMTypeMap[iM.type] as
      | "Module"
      | "Course File"
      | "Worktext"
      | "Textbook",
    coordinatorName: coordinatorUser.name ?? "",
    chairpersonName: chairpersonUser.name ?? "",
    seniorFacultyName: peerUser.name ?? "",
    ratings,
  };

  return response;
}

export async function readIMF012({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const college = await prisma.college.findFirstOrThrow({
    where: {
      Department: {
        some: {
          id: {
            equals: department.id,
          },
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Coordinator: {
            QAMISCoordinatorEndorsement: {
              some: {
                QAMISRevision: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const chairpersonUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Chairperson: {
            QAMISChairpersonEndorsement: {
              some: {
                QAMISRevision: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const deanUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Dean: {
            QAMISDeanEndorsement: {
              some: {
                QAMISRevision: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const response: F012Props = {
    iMTitle: iM?.title,
    authorNames: authorNames.join(", "),
    iMType: iMTypeMap[iM.type] as
      | "Module"
      | "Course File"
      | "Worktext"
      | "Textbook",
    departmentName: department.name,
    collegeName: college.name,
    coordinatorName: coordinatorUser.name ?? "",
    applicantName: iMAuthor.name ?? "",
    chairpersonName: chairpersonUser.name ?? "",
    deanName: deanUser.name ?? "",
  };

  return response;
}

export async function readIMF011({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const college = await prisma.college.findFirstOrThrow({
    where: {
      Department: {
        some: {
          id: {
            equals: department.id,
          },
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Coordinator: {
            CoordinatorEndorsement: {
              some: {
                DepartmentRevision: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const chairpersonUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Chairperson: {
            ChairpersonReview: {
              some: {
                ChairpersonSuggestion: {
                  SubmittedChairpersonSuggestion: {
                    ChairpersonSuggestion: {
                      ChairpersonReview: {
                        DepartmentReview: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const deanUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Dean: {
            DeanEndorsement: {
              some: {
                CoordinatorEndorsement: {
                  DepartmentRevision: {
                    IMFile: {
                      IM: {
                        id: {
                          equals: id as string,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      IDDCoordinator: {
        IDDCoordinatorEndorsement: {
          some: {
            CITLRevision: {
              IMFile: {
                IM: {
                  id: {
                    equals: id as string,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const response: F011Props = {
    iMTitle: iM?.title,
    authorName: iMAuthor.name ?? "",
    iMType: iMTypeMap[iM.type] as
      | "Module"
      | "Course File"
      | "Worktext"
      | "Textbook",
    coordinatorName: coordinatorUser.name ?? "",
    iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
    chairpersonName: chairpersonUser.name ?? "",
    deanName: deanUser.name ?? "",
  };

  return response;
}

export async function readIMF005({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };

  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const response: F005Props = {
    iMTitle: iM?.title,
  };

  return response;
}

export async function readIMF004({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const response: F004Props = {
    iMTitle: iM?.title,
  };

  return response;
}

export async function readIMF003({ id }: { id: string }) {
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Coordinator: {
            CoordinatorReview: {
              some: {
                CoordinatorSuggestion: {
                  SubmittedCoordinatorSuggestion: {
                    CoordinatorSuggestion: {
                      CoordinatorReview: {
                        DepartmentReview: {
                          IMFile: {
                            IM: {
                              id: {
                                equals: id as string,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const programReview: F003Suggestion[] = [];
  const peerSuggestionItems = await prisma.peerSuggestionItem.findMany({
    where: {
      PeerSuggestion: {
        SubmittedPeerSuggestion: {
          PeerSuggestion: {
            PeerReview: {
              DepartmentReview: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  for (let peerSuggestionItem of peerSuggestionItems) {
    const actionTaken = await prisma.peerSuggestionItemActionTaken.findFirst({
      where: {
        PeerSuggestionItem: {
          id: {
            equals: peerSuggestionItem.id,
          },
        },
      },
    });
    programReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: peerSuggestionItem.pageNumber,
      remarks: peerSuggestionItem.remarks ?? "",
      suggestion: peerSuggestionItem.suggestion,
    });
  }
  const chairpersonSuggestionItems =
    await prisma.chairpersonSuggestionItem.findMany({
      where: {
        ChairpersonSuggestion: {
          SubmittedChairpersonSuggestion: {
            ChairpersonSuggestion: {
              ChairpersonReview: {
                DepartmentReview: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let chairpersonSuggestionItem of chairpersonSuggestionItems) {
    const actionTaken =
      await prisma.chairpersonSuggestionItemActionTaken.findFirst({
        where: {
          ChairpersonSuggestionItem: {
            id: {
              equals: chairpersonSuggestionItem.id,
            },
          },
        },
      });
    programReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: chairpersonSuggestionItem.pageNumber,
      remarks: chairpersonSuggestionItem.remarks ?? "",
      suggestion: chairpersonSuggestionItem.suggestion,
    });
  }
  const coordinatorSuggestionItems =
    await prisma.coordinatorSuggestionItem.findMany({
      where: {
        CoordinatorSuggestion: {
          SubmittedCoordinatorSuggestion: {
            CoordinatorSuggestion: {
              CoordinatorReview: {
                DepartmentReview: {
                  IMFile: {
                    IM: {
                      id: {
                        equals: id as string,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let coordinatorSuggestionItem of coordinatorSuggestionItems) {
    const actionTaken =
      await prisma.coordinatorSuggestionItemActionTaken.findFirst({
        where: {
          CoordinatorSuggestionItem: {
            id: {
              equals: coordinatorSuggestionItem.id,
            },
          },
        },
      });
    programReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: coordinatorSuggestionItem.pageNumber,
      remarks: coordinatorSuggestionItem.remarks ?? "",
      suggestion: coordinatorSuggestionItem.suggestion,
    });
  }
  const returnedDepartmentRevisionSuggestionItems =
    await prisma.returnedDepartmentRevisionSuggestionItem.findMany({
      where: {
        ReturnedDepartmentRevision: {
          SubmittedReturnedDepartmentRevision: {
            ReturnedDepartmentRevision: {
              DepartmentRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let returnedDepartmentRevisionSuggestionItem of returnedDepartmentRevisionSuggestionItems) {
    const actionTaken =
      await prisma.returnedDepartmentRevisionSuggestionItemActionTaken.findFirst(
        {
          where: {
            ReturnedDepartmentRevisionSuggestionItem: {
              id: {
                equals: returnedDepartmentRevisionSuggestionItem.id,
              },
            },
          },
        }
      );
    programReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: returnedDepartmentRevisionSuggestionItem.pageNumber,
      remarks: returnedDepartmentRevisionSuggestionItem.remarks ?? "",
      suggestion: returnedDepartmentRevisionSuggestionItem.suggestion,
    });
  }

  const cITLReview = [];
  const iDDCoordinatorSuggestionItems =
    await prisma.iDDCoordinatorSuggestionItem.findMany({
      where: {
        IDDCoordinatorSuggestion: {
          SubmittedIDDCoordinatorSuggestion: {
            IDDCoordinatorSuggestion: {
              DeanEndorsement: {
                CoordinatorEndorsement: {
                  DepartmentRevision: {
                    IMFile: {
                      IM: {
                        id: {
                          equals: id as string,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let iDDCoordinatorSuggestionItem of iDDCoordinatorSuggestionItems) {
    const actionTaken =
      await prisma.iDDCoordinatorSuggestionItemActionTaken.findFirst({
        where: {
          IDDCoordinatorSuggestionItem: {
            id: {
              equals: iDDCoordinatorSuggestionItem.id,
            },
          },
        },
      });
    cITLReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: iDDCoordinatorSuggestionItem.pageNumber,
      remarks: iDDCoordinatorSuggestionItem.remarks ?? "",
      suggestion: iDDCoordinatorSuggestionItem.suggestion,
    });
  }
  const returnedCITLRevisionSuggestionItems =
    await prisma.returnedCITLRevisionSuggestionItem.findMany({
      where: {
        ReturnedCITLRevision: {
          SubmittedReturnedCITLRevision: {
            ReturnedCITLRevision: {
              CITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  for (let returnedCITLRevisionSuggestionItem of returnedCITLRevisionSuggestionItems) {
    const actionTaken =
      await prisma.returnedCITLRevisionSuggestionItemActionTaken.findFirst({
        where: {
          ReturnedCITLRevisionSuggestionItem: {
            id: {
              equals: returnedCITLRevisionSuggestionItem.id,
            },
          },
        },
      });
    cITLReview.push({
      actionTaken: actionTaken?.value ?? "",
      pageNumber: returnedCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedCITLRevisionSuggestionItem.remarks ?? "",
      suggestion: returnedCITLRevisionSuggestionItem.suggestion,
    });
  }

  const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      IDDCoordinator: {
        IDDCoordinatorSuggestion: {
          some: {
            SubmittedIDDCoordinatorSuggestion: {
              IDDCoordinatorSuggestion: {
                DeanEndorsement: {
                  CoordinatorEndorsement: {
                    DepartmentRevision: {
                      IMFile: {
                        IM: {
                          id: {
                            equals: id as string,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const cITLDirectorUser = await prisma.user.findFirstOrThrow({
    where: {
      CITLDirector: {
        CITLDirectorEndorsement: {
          some: {
            IDDCoordinatorEndorsement: {
              CITLRevision: {
                IMFile: {
                  IM: {
                    id: {
                      equals: id as string,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const response: F003Props = {
    iMTitle: iM.title,
    cITLDirectorName: cITLDirectorUser.name ?? "",
    coordinatorName: coordinatorUser.name ?? "",
    iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
    vPAAName: process.env.NEXT_PUBLIC_VPAA_NAME ?? "",
    cITLReview,
    programReview,
  };

  return response;
}

export async function readIMF001({ id }: { id: string }) {
  const iMTypeMap = {
    MODULE: "Module",
    COURSE_FILE: "Course File",
    WORKTEXT: "Worktext",
    TEXTBOOK: "Textbook",
  };
  const iM = await prisma.iM.findUniqueOrThrow({
    where: {
      id: id as string,
    },
  });

  const iMAuthor = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const coAuthors = await prisma.coAuthor.findMany({
    where: {
      IM: {
        id: {
          equals: id as string,
        },
      },
    },
  });
  const authorNames: string[] = [];
  authorNames.push(iMAuthor?.name ?? "");
  for (let coAuthor of coAuthors) {
    const coAuthorUser = await prisma.user.findFirstOrThrow({
      where: {
        Faculty: {
          some: {
            id: {
              equals: coAuthor.facultyId,
            },
          },
        },
      },
    });

    if (coAuthorUser?.name) {
      authorNames.push(coAuthorUser?.name);
    }
  }

  const department = await prisma.department.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          IM: {
            some: {
              id: {
                equals: id as string,
              },
            },
          },
        },
      },
    },
  });

  const college = await prisma.college.findFirstOrThrow({
    where: {
      Department: {
        some: {
          id: {
            equals: department.id,
          },
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      Faculty: {
        some: {
          Coordinator: {
            AND: [
              {
                ActiveCoordinator: {
                  isNot: null,
                },
              },
              {
                Faculty: {
                  Department: {
                    id: {
                      equals: department.id,
                    },
                  },
                },
              },
            ],
          },
        },
      },
    },
  });

  const iDDCoordinatorUser = await prisma.user.findFirstOrThrow({
    where: {
      IDDCoordinator: {
        ActiveIDDCoordinator: {
          isNot: null,
        },
      },
    },
  });
  const response: F001Props = {
    iMTitle: iM?.title,
    authorNames: authorNames.join(", "),
    iMType: iMTypeMap[iM.type] as
      | "Module"
      | "Course File"
      | "Worktext"
      | "Textbook",
    departmentName: department.name,
    collegeName: college.name,
    coordinatorName: coordinatorUser.name ?? "",
    iDDCoordinatorName: iDDCoordinatorUser.name ?? "",
  };

  return response;
}

export async function readIMAll({ id }: { id: string }) {
  const qAMISDepartmentEndorsed: Prisma.QAMISDepartmentEndorsementInclude = {
    ContentSpecialistReview: {
      include: {
        ContentSpecialistSuggestion: {
          include: {
            ContentSpecialistSuggestionItem: {
              include: {
                ContentSpecialistSuggestionItemActionTaken: true,
              },
            },
            SubmittedContentSpecialistSuggestion: {
              include: {
                IMERCCITLReviewed: {
                  include: {
                    PlagiarismFile: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    IDDSpecialistReview: {
      include: {
        IDDSpecialistSuggestion: {
          include: {
            IDDSpecialistSuggestionItem: {
              include: {
                IDDSpecialistSuggestionItemActionTaken: true,
              },
            },
            SubmittedIDDSpecialistSuggestion: {
              include: {
                IMERCCITLReviewed: {
                  include: {
                    PlagiarismFile: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    ContentEditorReview: {
      include: {
        ContentEditorSuggestion: {
          include: {
            ContentEditorSuggestionItem: {
              include: {
                ContentEditorSuggestionItemActionTaken: true,
              },
            },
            SubmittedContentEditorSuggestion: {
              include: {
                IMERCCITLReviewed: {
                  include: {
                    PlagiarismFile: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const iM = await prisma.iM.findFirstOrThrow({
    where: {
      AND: [
        {
          id: {
            equals: id as string,
          },
        },
      ],
    },
    include: {
      Faculty: true,
      IMFile: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          DepartmentReview: {
            include: {
              ChairpersonReview: {
                include: {
                  Chairperson: true,
                  ChairpersonSuggestion: {
                    include: {
                      ChairpersonSuggestionItem: {
                        include: {
                          ChairpersonSuggestionItemActionTaken: true,
                        },
                      },
                      SubmittedChairpersonSuggestion: {
                        include: {
                          DepartmentReviewed: true,
                        },
                      },
                    },
                  },
                },
              },
              CoordinatorReview: {
                include: {
                  Coordinator: true,
                  CoordinatorSuggestion: {
                    include: {
                      CoordinatorSuggestionItem: {
                        include: {
                          CoordinatorSuggestionItemActionTaken: true,
                        },
                      },
                      SubmittedCoordinatorSuggestion: {
                        include: {
                          DepartmentReviewed: true,
                        },
                      },
                    },
                  },
                },
              },
              PeerReview: {
                include: {
                  Faculty: true,
                  PeerSuggestion: {
                    include: {
                      PeerSuggestionItem: {
                        include: {
                          PeerSuggestionItemActionTaken: true,
                        },
                      },
                      SubmittedPeerSuggestion: {
                        include: {
                          DepartmentReviewed: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          DepartmentRevision: {
            include: {
              ReturnedDepartmentRevision: {
                include: {
                  ReturnedDepartmentRevisionSuggestionItem: {
                    include: {
                      ReturnedDepartmentRevisionSuggestionItemActionTaken: true,
                    },
                  },
                  SubmittedReturnedDepartmentRevision: {
                    include: {
                      IMFile: true,
                    },
                  },
                },
              },
              CoordinatorEndorsement: {
                include: {
                  DeanEndorsement: {
                    include: {
                      IDDCoordinatorSuggestion: {
                        include: {
                          IDDCoordinatorSuggestionItem: {
                            include: {
                              IDDCoordinatorSuggestionItemActionTaken: true,
                            },
                          },
                          SubmittedIDDCoordinatorSuggestion: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          CITLRevision: {
            include: {
              ReturnedCITLRevision: {
                include: {
                  ReturnedCITLRevisionSuggestionItem: {
                    include: {
                      ReturnedCITLRevisionSuggestionItemActionTaken: true,
                    },
                  },
                  SubmittedReturnedCITLRevision: true,
                },
              },
              IDDCoordinatorEndorsement: {
                include: {
                  CITLDirectorEndorsement: {
                    include: {
                      QAMISSuggestion: {
                        include: {
                          QAMISSuggestionItem: true,
                          SubmittedQAMISSuggestion: {
                            include: {
                              QAMISFile: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          QAMISRevision: {
            include: {
              QAMISChairpersonEndorsement: {
                include: {
                  QAMISDepartmentEndorsement: {
                    include: qAMISDepartmentEndorsed,
                  },
                },
              },
              QAMISCoordinatorEndorsement: {
                include: {
                  QAMISDepartmentEndorsement: {
                    include: qAMISDepartmentEndorsed,
                  },
                },
              },
              QAMISDeanEndorsement: {
                include: {
                  QAMISDepartmentEndorsement: {
                    include: qAMISDepartmentEndorsed,
                  },
                },
              },
            },
          },
          IMERCCITLRevision: {
            include: {
              ReturnedIMERCCITLRevision: {
                include: {
                  ReturnedIMERCCITLRevisionSuggestionItem: {
                    include: {
                      ReturnedIMERCCITLRevisionSuggestionItemActionTaken: true,
                    },
                  },
                  SubmittedReturnedIMERCCITLRevision: true,
                },
              },
              IMERCIDDCoordinatorEndorsement: {
                include: {
                  IMERCCITLDirectorEndorsement: true,
                },
              },
            },
          },
          DepartmentReviewed: true,
          IMERCCITLReviewed: true,
          SubmittedIDDCoordinatorSuggestion: true,
          SubmittedQAMISSuggestion: true,
          SubmittedReturnedCITLRevision: true,
          SubmittedReturnedDepartmentRevision: true,
          SubmittedReturnedIMERCCITLRevision: true,
        },
      },
    },
  });

  return iM;
}
