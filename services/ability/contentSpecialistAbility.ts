import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentSpecialistAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security
    can("read", "ContentSpecialist");
  });

  return ability;
}
