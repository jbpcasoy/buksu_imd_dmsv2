import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentSpecialistSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ContentSpecialistSuggestionItemActionTaken");
    can("create", "ContentSpecialistSuggestionItemActionTaken");
    can("update", "ContentSpecialistSuggestionItemActionTaken");
    can("delete", "ContentSpecialistSuggestionItemActionTaken");
  });

  return ability;
}
