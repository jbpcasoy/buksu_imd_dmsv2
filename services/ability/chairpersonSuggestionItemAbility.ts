import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function chairpersonSuggestionItemAbility({
  user,
}: {
  user: User;
}) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ChairpersonSuggestionItem");
    can("create", "ChairpersonSuggestionItem");
    can("update", "ChairpersonSuggestionItem");
    can("delete", "ChairpersonSuggestionItem");
  });

  return ability;
}
