import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMERCIDDCoordinatorEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IMERCIDDCoordinatorEndorsement");
    can("create", "IMERCIDDCoordinatorEndorsement");
    can("update", "IMERCIDDCoordinatorEndorsement");
    can("delete", "IMERCIDDCoordinatorEndorsement");
  });

  return ability;
}
