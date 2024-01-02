import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeCoordinatorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ActiveCoordinator");
    if (user.isAdmin) {
      can("create", "ActiveCoordinator");
      can("update", "ActiveCoordinator");
      can("delete", "ActiveCoordinator");
    }
  });

  return ability;
}
