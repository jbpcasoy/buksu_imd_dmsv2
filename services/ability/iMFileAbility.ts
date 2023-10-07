import { Faculty, IM, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMFileAbility({
  userFaculty,
  iM,
  user,
}: {
  user: User;
  userFaculty?: Faculty | null;
  iM?: IM | null;
}) {
  const ability = abilityBuilder((can, cannot) => {
    if (iM?.facultyId === userFaculty?.id && userFaculty?.userId === user.id) {
      can("create", "IMFile");
      can("read", "IMFile");
      can("delete", "IMFile");
    }

    if (user.isAdmin) {
      can("create", "IMFile");
      can("read", "IMFile");
      can("delete", "IMFile");
    }
  });

  return ability;
}
