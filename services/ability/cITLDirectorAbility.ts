import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function cITLDirectorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "CITLDirector");

    if (user.isAdmin) {
      // TODO remove this
      can("connectToIM", "CITLDirector");
    }
  });

  return ability;
}
