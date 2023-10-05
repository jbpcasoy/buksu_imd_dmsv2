import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default async function facultyAbility(user: User) {
  try {
    const activeFaculty = await prisma.activeFaculty.findFirstOrThrow({
      where: {
        Faculty: {
          userId: {
            equals: user.id,
          },
        },
      },
    });
    const faculty = await prisma.faculty.findFirstOrThrow({
      where: {
        id: {
          equals: activeFaculty.facultyId,
        },
      },
    });

    const ability = await abilityBuilder((can, cannot) => {
      //   can("read", "IM", {
      //     Faculty: {
      //       departmentId: {
      //         equals: faculty.departmentId,
      //       },
      //     },
      //   });

      //   can("update", "IM", {
      //     facultyId: {
      //       equals: faculty.userId,
      //     },
      //   });

      //   can("delete", "IM", {
      //     facultyId: {
      //       equals: faculty.userId,
      //     },
      //   });
      can("connectToIM", "Faculty", {
        ActiveFaculty: {
          isNot: null,
        },
        userId: {
          equals: user.id,
        },
      });
    });

    return ability;
  } catch (error) {
    const ability = await abilityBuilder((can, cannot) => {});
    return ability;
  }
}
