import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedDepartmentRevisionSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedDepartmentRevisionSuggestionItemActionTaken");
    can("create", "ReturnedDepartmentRevisionSuggestionItemActionTaken");
    can("update", "ReturnedDepartmentRevisionSuggestionItemActionTaken");
    can("delete", "ReturnedDepartmentRevisionSuggestionItemActionTaken");
  });

  return ability;
}
