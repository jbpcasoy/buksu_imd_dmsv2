import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedCITLRevisionSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedCITLRevisionSuggestionItem");
    can("create", "ReturnedCITLRevisionSuggestionItem");
    can("update", "ReturnedCITLRevisionSuggestionItem");
    can("delete", "ReturnedCITLRevisionSuggestionItem");
  });

  return ability;
}
