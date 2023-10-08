import { ActiveFaculty, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMAbility({
  user,
  userActiveFaculty,
}: {
  user: User;
  userActiveFaculty?: ActiveFaculty | null;
}) {
  const ability = abilityBuilder((can, cannot) => {
    can("connectToIMFile", "IM", {
      facultyId: {
        equals: userActiveFaculty?.facultyId,
      },
    });
    can("read", "IM", {
      facultyId: {
        equals: userActiveFaculty?.facultyId,
      },
    });
    can("update", "IM", {
      facultyId: {
        equals: userActiveFaculty?.facultyId,
      },
    });
    can("delete", "IM", {
      facultyId: {
        equals: userActiveFaculty?.facultyId,
      },
    });
    if (user.isAdmin) {
      can("connectToIMFile", "IM");
      can("read", "IM");
      can("update", "IM");
      can("delete", "IM");
    }
  });

  return ability;
}
