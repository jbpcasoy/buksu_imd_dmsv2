import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function cITLDirectorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "CITLDirector");

    if (user.isAdmin) {
      can("connectToIM", "CITLDirector");
      can("create", "CITLDirector");
      can("delete", "CITLDirector");
    }
  });

  return ability;
}
