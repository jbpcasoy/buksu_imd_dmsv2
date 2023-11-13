import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentEditorSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ContentEditorSuggestionItemActionTaken");
    can("create", "ContentEditorSuggestionItemActionTaken");
    can("update", "ContentEditorSuggestionItemActionTaken");
    can("delete", "ContentEditorSuggestionItemActionTaken");
  });

  return ability;
}
