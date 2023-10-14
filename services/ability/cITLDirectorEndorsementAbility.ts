import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function cITLDirectorEndorsementAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "CITLDirectorEndorsement");
    can("create", "CITLDirectorEndorsement");
    can("update", "CITLDirectorEndorsement");
    can("delete", "CITLDirectorEndorsement");
  });

  return ability;
}
