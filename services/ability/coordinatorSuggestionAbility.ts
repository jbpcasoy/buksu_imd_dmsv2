import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "CoordinatorSuggestion");
    if (user.isAdmin) {
      can("create", "CoordinatorSuggestion");
      can("update", "CoordinatorSuggestion");
      can("delete", "CoordinatorSuggestion");
    }
  });

  return ability;
}
