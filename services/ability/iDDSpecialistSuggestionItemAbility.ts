import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDSpecialistSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IDDSpecialistSuggestionItem");
    can("create", "IDDSpecialistSuggestionItem");
    can("update", "IDDSpecialistSuggestionItem");
    can("delete", "IDDSpecialistSuggestionItem");
  });

  return ability;
}
