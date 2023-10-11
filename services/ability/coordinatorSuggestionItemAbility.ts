import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "CoordinatorSuggestionItem");
    can("create", "CoordinatorSuggestionItem");
    can("update", "CoordinatorSuggestionItem");
    can("delete", "CoordinatorSuggestionItem");
  });

  return ability;
}
