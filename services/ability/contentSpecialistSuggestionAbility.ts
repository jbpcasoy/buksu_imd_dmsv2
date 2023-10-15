import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentSpecialistSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ContentSpecialistSuggestion");
    can("create", "ContentSpecialistSuggestion");
    can("update", "ContentSpecialistSuggestion");
    can("delete", "ContentSpecialistSuggestion");
  });

  return ability;
}
