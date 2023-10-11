import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function chairpersonReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ChairpersonReview");
    can("create", "ChairpersonReview");
    can("update", "ChairpersonReview");
    can("delete", "ChairpersonReview");
  });

  return ability;
}
