import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "CoordinatorEndorsement");
    can("create", "CoordinatorEndorsement");
    can("update", "CoordinatorEndorsement");
    can("delete", "CoordinatorEndorsement");
  });

  return ability;
}
