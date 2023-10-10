import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function peerReviewAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "PeerReview");
    can("create", "PeerReview");
    can("update", "PeerReview");
    can("delete", "PeerReview");
  });

  return ability;
}
