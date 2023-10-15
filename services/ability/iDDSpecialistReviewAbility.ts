import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iDDSpecialistReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IDDSpecialistReview");
    can("create", "IDDSpecialistReview");
    can("update", "IDDSpecialistReview");
    can("delete", "IDDSpecialistReview");
  });

  return ability;
}
