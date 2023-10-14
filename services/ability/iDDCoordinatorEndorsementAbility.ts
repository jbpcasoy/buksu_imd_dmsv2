import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDCoordinatorEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IDDCoordinatorEndorsement");
    can("create", "IDDCoordinatorEndorsement");
    can("update", "IDDCoordinatorEndorsement");
    can("delete", "IDDCoordinatorEndorsement");
  });

  return ability;
}
