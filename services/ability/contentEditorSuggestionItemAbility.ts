import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentEditorSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ContentEditorSuggestionItem");
    can("create", "ContentEditorSuggestionItem");
    can("update", "ContentEditorSuggestionItem");
    can("delete", "ContentEditorSuggestionItem");
  });

  return ability;
}
