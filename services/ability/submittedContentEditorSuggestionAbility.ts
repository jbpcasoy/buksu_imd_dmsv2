import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedContentEditorSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedContentEditorSuggestion");
    can("create", "SubmittedContentEditorSuggestion");
    can("update", "SubmittedContentEditorSuggestion");
    can("delete", "SubmittedContentEditorSuggestion");
  });

  return ability;
}
