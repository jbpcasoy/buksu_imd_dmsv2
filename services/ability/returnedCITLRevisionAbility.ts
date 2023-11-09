import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedCITLRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedCITLRevision");
    can("create", "ReturnedCITLRevision");
    can("update", "ReturnedCITLRevision");
    can("delete", "ReturnedCITLRevision");
  });

  return ability;
}
