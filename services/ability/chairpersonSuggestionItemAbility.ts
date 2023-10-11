import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function chairpersonSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "ChairpersonSuggestion");
    if (user.isAdmin) {
      can("create", "ChairpersonSuggestion");
      can("update", "ChairpersonSuggestion");
      can("delete", "ChairpersonSuggestion");
    }
  });

  return ability;
}
