import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISCoordinatorEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "QAMISCoordinatorEndorsement");
    can("create", "QAMISCoordinatorEndorsement");
    can("update", "QAMISCoordinatorEndorsement");
    can("delete", "QAMISCoordinatorEndorsement");
  });

  return ability;
}
