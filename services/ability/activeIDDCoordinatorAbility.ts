import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeIDDCoordinatorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ActiveIDDCoordinator");
    if (user.isAdmin) {
      can("create", "ActiveIDDCoordinator");
      can("delete", "ActiveIDDCoordinator");
    }
  });

  return ability;
}
