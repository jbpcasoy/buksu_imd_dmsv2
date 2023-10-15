import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function iMERCCITLReviewedAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "IMERCCITLReviewed");
    can("create", "IMERCCITLReviewed");
    can("update", "IMERCCITLReviewed");
    can("delete", "IMERCCITLReviewed");
  });

  return ability;
}
