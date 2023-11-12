import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function chairpersonSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ChairpersonSuggestionItemActionTaken");
    can("create", "ChairpersonSuggestionItemActionTaken");
    can("update", "ChairpersonSuggestionItemActionTaken");
    can("delete", "ChairpersonSuggestionItemActionTaken");
  });

  return ability;
}
