import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedIMERCCITLRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedIMERCCITLRevision");
    can("create", "ReturnedIMERCCITLRevision");
    can("update", "ReturnedIMERCCITLRevision");
    can("delete", "ReturnedIMERCCITLRevision");
  });

  return ability;
}
