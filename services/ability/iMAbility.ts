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
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
