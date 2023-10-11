import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedChairpersonSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedChairpersonSuggestion");
    can("create", "SubmittedChairpersonSuggestion");
    can("update", "SubmittedChairpersonSuggestion");
    can("delete", "SubmittedChairpersonSuggestion");
  });

  return ability;
}
