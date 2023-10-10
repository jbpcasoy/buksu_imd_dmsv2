import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function peerSuggestionItemAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "PeerSuggestionItem");
    can("create", "PeerSuggestionItem");
    can("update", "PeerSuggestionItem");
    can("delete", "PeerSuggestionItem");
  });

  return ability;
}
