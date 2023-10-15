import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentSpecialistSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ContentSpecialistSuggestionItem");
    can("create", "ContentSpecialistSuggestionItem");
    can("update", "ContentSpecialistSuggestionItem");
    can("delete", "ContentSpecialistSuggestionItem");
  });

  return ability;
}
