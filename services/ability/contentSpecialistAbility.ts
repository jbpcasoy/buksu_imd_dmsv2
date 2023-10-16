import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentSpecialistAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security
    can("read", "ContentSpecialist");

    if (user.isAdmin) {
      can("create", "ContentSpecialist");
      can("update", "ContentSpecialist");
      can("delete", "ContentSpecialist");
    }
  });

  return ability;
}
