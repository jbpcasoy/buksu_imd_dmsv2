import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedReturnedIMERCCITLRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedReturnedIMERCCITLRevision");
    can("create", "SubmittedReturnedIMERCCITLRevision");
    can("update", "SubmittedReturnedIMERCCITLRevision");
    can("delete", "SubmittedReturnedIMERCCITLRevision");
  });

  return ability;
}
