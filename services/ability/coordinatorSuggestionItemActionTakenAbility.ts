import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "CoordinatorSuggestionItemActionTaken");
    can("create", "CoordinatorSuggestionItemActionTaken");
    can("update", "CoordinatorSuggestionItemActionTaken");
    can("delete", "CoordinatorSuggestionItemActionTaken");
  });

  return ability;
}
