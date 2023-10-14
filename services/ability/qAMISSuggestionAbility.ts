import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "QAMISSuggestion");
    can("create", "QAMISSuggestion");
    can("update", "QAMISSuggestion");
    can("delete", "QAMISSuggestion");
  });

  return ability;
}
