import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function departmentReviewedAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "DepartmentReviewed");
    can("create", "DepartmentReviewed");
    can("update", "DepartmentReviewed");
    can("delete", "DepartmentReviewed");
  });

  return ability;
}
