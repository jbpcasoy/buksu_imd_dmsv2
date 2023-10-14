import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDCoordinatorSuggestionItemAbility({
  user,
}: {
  user: User;
}) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "IDDCoordinatorSuggestionItem");
    can("create", "IDDCoordinatorSuggestionItem");
    can("update", "IDDCoordinatorSuggestionItem");
    can("delete", "IDDCoordinatorSuggestionItem");
  });

  return ability;
}
