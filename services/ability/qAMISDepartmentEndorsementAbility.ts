import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISDepartmentEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "QAMISDepartmentEndorsement");
    can("create", "QAMISDepartmentEndorsement");
    can("update", "QAMISDepartmentEndorsement");
    can("delete", "QAMISDepartmentEndorsement");
  });

  return ability;
}
