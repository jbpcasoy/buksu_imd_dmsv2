import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function returnedDepartmentRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ReturnedDepartmentRevision");
    can("create", "ReturnedDepartmentRevision");
    can("update", "ReturnedDepartmentRevision");
    can("delete", "ReturnedDepartmentRevision");
  });

  return ability;
}
