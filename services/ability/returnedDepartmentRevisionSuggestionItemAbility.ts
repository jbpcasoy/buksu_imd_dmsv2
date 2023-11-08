import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedDepartmentRevisionSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedDepartmentRevisionSuggestionItem");
    can("create", "ReturnedDepartmentRevisionSuggestionItem");
    can("update", "ReturnedDepartmentRevisionSuggestionItem");
    can("delete", "ReturnedDepartmentRevisionSuggestionItem");
  });

  return ability;
}
