import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedReturnedCITLRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedReturnedCITLRevision");
    can("create", "SubmittedReturnedCITLRevision");
    can("update", "SubmittedReturnedCITLRevision");
    can("delete", "SubmittedReturnedCITLRevision");
  });

  return ability;
}
