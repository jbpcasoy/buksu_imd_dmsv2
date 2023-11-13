import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDSpecialistSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IDDSpecialistSuggestionItemActionTaken");
    can("create", "IDDSpecialistSuggestionItemActionTaken");
    can("update", "IDDSpecialistSuggestionItemActionTaken");
    can("delete", "IDDSpecialistSuggestionItemActionTaken");
  });

  return ability;
}
