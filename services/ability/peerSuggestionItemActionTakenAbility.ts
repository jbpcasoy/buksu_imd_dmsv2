import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function peerSuggestionItemActionTakenAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "PeerSuggestionItemActionTaken");
    can("create", "PeerSuggestionItemActionTaken");
    can("update", "PeerSuggestionItemActionTaken");
    can("delete", "PeerSuggestionItemActionTaken");
  });

  return ability;
}
