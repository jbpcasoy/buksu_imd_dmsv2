import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedCITLRevisionSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedCITLRevisionSuggestionItemActionTaken");
    can("create", "ReturnedCITLRevisionSuggestionItemActionTaken");
    can("update", "ReturnedCITLRevisionSuggestionItemActionTaken");
    can("delete", "ReturnedCITLRevisionSuggestionItemActionTaken");
  });

  return ability;
}
