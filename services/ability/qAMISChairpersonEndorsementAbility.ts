import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISChairpersonEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "QAMISChairpersonEndorsement");
    can("create", "QAMISChairpersonEndorsement");
    can("update", "QAMISChairpersonEndorsement");
    can("delete", "QAMISChairpersonEndorsement");
  });

  return ability;
}
