import { ActiveFaculty, Faculty, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";
import prisma from "@/prisma/client";

export default async function iMAbility(user: User, faculty: Faculty) {
  try {
    const ability = await abilityBuilder((can, cannot) => {
      can("read", "IM", {
        Faculty: {
          departmentId: {
            equals: faculty.departmentId,
          },
        },
      });

      can("update", "IM", {
        facultyId: {
          equals: faculty.userId,
        },
      });

      can("delete", "IM", {
        facultyId: {
          equals: faculty.userId,
        },
      });
    });

    return ability;
  } catch (error) {
    const ability = await abilityBuilder((can, cannot) => {});
    return ability;
  }
}
