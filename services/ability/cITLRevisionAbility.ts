import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function cITLRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "CITLRevision");
    can("create", "CITLRevision");
    can("update", "CITLRevision");
    can("delete", "CITLRevision");
  });

  return ability;
}
