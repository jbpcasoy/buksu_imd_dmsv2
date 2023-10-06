import { Faculty, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMAbility(user: User, faculty: Faculty) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      can("read", "IM", {
        Faculty: {
          departmentId: {
            equals: faculty.departmentId,
          },
        },
      });

      can("createIM", "Faculty", {
        userId: {
          equals: user.id,
        },
      });

      can("update", "IM", {
        facultyId: {
          equals: faculty.id,
        },
      });

      can("delete", "IM", {
        facultyId: {
          equals: faculty.id,
        },
      });

      if (user.isAdmin) {
        can("read", "IM");
        can("update", "IM");
        can("update", "IM");
      }
    });

    return ability;
  } catch (error) {
    console.error(error);
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
