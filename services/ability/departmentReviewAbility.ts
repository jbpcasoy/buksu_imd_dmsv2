import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function departmentReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "DepartmentReview");
    can("update", "DepartmentReview");
    can("delete", "DepartmentReview");
  });

  return ability;
}
