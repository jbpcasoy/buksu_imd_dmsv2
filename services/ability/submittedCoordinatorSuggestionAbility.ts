import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedCoordinatorSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedCoordinatorSuggestion");
    can("create", "SubmittedCoordinatorSuggestion");
    can("update", "SubmittedCoordinatorSuggestion");
    can("delete", "SubmittedCoordinatorSuggestion");
  });

  return ability;
}
