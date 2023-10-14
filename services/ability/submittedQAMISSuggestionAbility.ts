import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedQAMISSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedQAMISSuggestion");
    can("create", "SubmittedQAMISSuggestion");
    can("update", "SubmittedQAMISSuggestion");
    can("delete", "SubmittedQAMISSuggestion");
  });

  return ability;
}
