import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedReturnedDepartmentRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedReturnedDepartmentRevision");
    can("create", "SubmittedReturnedDepartmentRevision");
    can("update", "SubmittedReturnedDepartmentRevision");
    can("delete", "SubmittedReturnedDepartmentRevision");
  });

  return ability;
}
