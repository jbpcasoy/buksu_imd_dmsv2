import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function chairpersonAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security
    can("read", "Chairperson");
  });

  return ability;
}
