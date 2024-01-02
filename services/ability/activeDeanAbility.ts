import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeDeanAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ActiveDean");
    if (user.isAdmin) {
      can("create", "ActiveDean");
      can("update", "ActiveDean");
      can("delete", "ActiveDean");
    }
  });

  return ability;
}
