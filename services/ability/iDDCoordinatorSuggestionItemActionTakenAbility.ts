import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDCoordinatorSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IDDCoordinatorSuggestionItemActionTaken");
    can("create", "IDDCoordinatorSuggestionItemActionTaken");
    can("update", "IDDCoordinatorSuggestionItemActionTaken");
    can("delete", "IDDCoordinatorSuggestionItemActionTaken");
  });

  return ability;
}
