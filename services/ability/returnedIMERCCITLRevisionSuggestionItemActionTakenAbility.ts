import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedIMERCCITLRevisionSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedIMERCCITLRevisionSuggestionItemActionTaken");
    can("create", "ReturnedIMERCCITLRevisionSuggestionItemActionTaken");
    can("update", "ReturnedIMERCCITLRevisionSuggestionItemActionTaken");
    can("delete", "ReturnedIMERCCITLRevisionSuggestionItemActionTaken");
  });

  return ability;
}
