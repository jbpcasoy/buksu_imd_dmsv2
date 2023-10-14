import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function qAMISSuggestionItemAbility({
  user,
}: {
  user: User;
}) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "QAMISSuggestionItem");
    can("create", "QAMISSuggestionItem");
    can("update", "QAMISSuggestionItem");
    can("delete", "QAMISSuggestionItem");
  });

  return ability;
}
