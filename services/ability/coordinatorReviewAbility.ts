import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function coordinatorReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "CoordinatorReview");
    can("create", "CoordinatorReview");
    can("update", "CoordinatorReview");
    can("delete", "CoordinatorReview");
  });

  return ability;
}
