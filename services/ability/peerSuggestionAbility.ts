import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function peerSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    can("read", "PeerSuggestion");
    if (user.isAdmin) {
      can("create", "PeerSuggestion");
      can("update", "PeerSuggestion");
      can("delete", "PeerSuggestion");
    }
  });

  return ability;
}
