import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentEditorSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ContentEditorSuggestion");
    can("create", "ContentEditorSuggestion");
    can("update", "ContentEditorSuggestion");
    can("delete", "ContentEditorSuggestion");
  });

  return ability;
}
