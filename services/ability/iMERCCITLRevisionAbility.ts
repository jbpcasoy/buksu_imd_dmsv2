import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMERCCITLRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IMERCCITLRevision");
    can("create", "IMERCCITLRevision");
    can("update", "IMERCCITLRevision");
    can("delete", "IMERCCITLRevision");
  });

  return ability;
}
