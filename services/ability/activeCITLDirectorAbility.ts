import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeCITLDirectorAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ActiveCITLDirector");
    if (user.isAdmin) {
      can("create", "ActiveCITLDirector");
      can("delete", "ActiveCITLDirector");
    }
  });

  return ability;
}
