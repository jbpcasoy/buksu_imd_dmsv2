import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedIDDCoordinatorSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedIDDCoordinatorSuggestion");
    can("create", "SubmittedIDDCoordinatorSuggestion");
    can("update", "SubmittedIDDCoordinatorSuggestion");
    can("delete", "SubmittedIDDCoordinatorSuggestion");
  });

  return ability;
}
