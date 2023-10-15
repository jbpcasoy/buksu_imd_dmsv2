import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedIDDSpecialistSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedIDDSpecialistSuggestion");
    can("create", "SubmittedIDDSpecialistSuggestion");
    can("update", "SubmittedIDDSpecialistSuggestion");
    can("delete", "SubmittedIDDSpecialistSuggestion");
  });

  return ability;
}
