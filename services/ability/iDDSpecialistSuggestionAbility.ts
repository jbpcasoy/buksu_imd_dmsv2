import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDSpecialistSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "IDDSpecialistSuggestion");
    can("create", "IDDSpecialistSuggestion");
    can("update", "IDDSpecialistSuggestion");
    can("delete", "IDDSpecialistSuggestion");
  });

  return ability;
}
