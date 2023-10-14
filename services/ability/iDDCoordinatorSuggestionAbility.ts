import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDCoordinatorSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IDDCoordinatorSuggestion");
    can("create", "IDDCoordinatorSuggestion");
    can("update", "IDDCoordinatorSuggestion");
    can("delete", "IDDCoordinatorSuggestion");
  });

  return ability;
}
