import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function chairpersonAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security
    can("read", "Chairperson");

    if (user.isAdmin) {
      can("create", "Chairperson");
      can("update", "Chairperson");
      can("delete", "Chairperson");
    }
  });

  return ability;
}
