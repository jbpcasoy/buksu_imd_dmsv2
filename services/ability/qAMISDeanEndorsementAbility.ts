import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISDeanEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "QAMISDeanEndorsement");
    can("create", "QAMISDeanEndorsement");
    can("update", "QAMISDeanEndorsement");
    can("delete", "QAMISDeanEndorsement");
  });

  return ability;
}
