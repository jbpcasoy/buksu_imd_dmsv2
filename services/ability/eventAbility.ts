import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function eventAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "Event");
    can("create", "Event");

    if (user.isAdmin) {
      can("update", "Event");
      can("delete", "Event");
    }
  });

  return ability;
}
