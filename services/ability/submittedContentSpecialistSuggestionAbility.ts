import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedContentSpecialistSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedContentSpecialistSuggestion");
    can("create", "SubmittedContentSpecialistSuggestion");
    can("update", "SubmittedContentSpecialistSuggestion");
    can("delete", "SubmittedContentSpecialistSuggestion");
  });

  return ability;
}
