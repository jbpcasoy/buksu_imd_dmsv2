import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedIMERCCITLRevisionSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedIMERCCITLRevisionSuggestionItem");
    can("create", "ReturnedIMERCCITLRevisionSuggestionItem");
    can("update", "ReturnedIMERCCITLRevisionSuggestionItem");
    can("delete", "ReturnedIMERCCITLRevisionSuggestionItem");
  });

  return ability;
}
