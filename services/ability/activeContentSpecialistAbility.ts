import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function activeContentSpecialistAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ActiveContentSpecialist");
    if (user.isAdmin) {
      can("create", "ActiveContentSpecialist");
      can("delete", "ActiveContentSpecialist");
    }
  });

  return ability;
}
