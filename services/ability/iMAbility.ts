import { Department, Faculty, IM, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMAbility({
  user,
  userFaculty,
  iM,
}: {
  user: User;
  userFaculty?: Faculty | null;
  iM?: IM | null;
}) {
  const ability = abilityBuilder((can, cannot) => {
    //  User create IM for themselves
    if (userFaculty?.userId === user.id) {
      can("create", "IM");
    }
    //  User can read own IMs
    can("read", "IM", {
      facultyId: {
        equals: userFaculty?.id,
      },
    });

    //  User update own IM's
    if (iM?.facultyId === userFaculty?.id) {
      can("update", "IM");
    }
    //  User delete own IM's
    if (iM?.facultyId === userFaculty?.id) {
      can("delete", "IM");
    }

    if (user.isAdmin) {
      can("create", "IM");
      can("read", "IM");
      can("update", "IM");
      can("delete", "IM");
    }
  });

  return ability;
}
