import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function departmentRevisionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "DepartmentRevision");
    can("create", "DepartmentRevision");
    can("update", "DepartmentRevision");
    can("delete", "DepartmentRevision");
  });

  return ability;
}
