import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMERCCITLDirectorEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IMERCCITLDirectorEndorsement");
    can("create", "IMERCCITLDirectorEndorsement");
    can("update", "IMERCCITLDirectorEndorsement");
    can("delete", "IMERCCITLDirectorEndorsement");
  });

  return ability;
}
