import { Faculty, IM, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMFileAbility(user: User, faculty: Faculty, iM: IM) {
  try {
    const ability = abilityBuilder((can, cannot) => {
      if (iM.facultyId === faculty.id && faculty.userId === user.id) {
        can("createIMFile", "Faculty");
      }

      if (user.isAdmin) {
        can("createIMFile", "Faculty");
      }
    });

    return ability;
  } catch (error) {
    console.error(error);
    const ability = abilityBuilder((can, cannot) => {});
    return ability;
  }
}
