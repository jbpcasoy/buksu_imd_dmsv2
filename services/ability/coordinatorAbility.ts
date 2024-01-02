import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "Coordinator");
    if (user.isAdmin) {
      can("create", "Coordinator");
      can("update", "Coordinator");
      can("delete", "Coordinator");
    }
  });

  return ability;
}
