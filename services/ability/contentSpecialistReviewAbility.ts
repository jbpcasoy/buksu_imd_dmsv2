import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function contentSpecialistReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "ContentSpecialistReview");
    can("create", "ContentSpecialistReview");
    can("update", "ContentSpecialistReview");
    can("delete", "ContentSpecialistReview");
  });

  return ability;
}
