import { ActiveFaculty, Prisma, User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISFileAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "QAMISFile");
    can("delete", "QAMISFile");

    if (user.isAdmin) {
      can("read", "QAMISFile");
      can("delete", "QAMISFile");
    }
  });

  return ability;
}
