import { User } from "@prisma/client";
import abilityBuilder from "./abilityBuilder";

export default function submittedPeerSuggestionAbility({ user }: { user: User }) {
  const ability = abilityBuilder((can, cannot) => {
    // implement security 
    can("read", "SubmittedPeerSuggestion");
    can("create", "SubmittedPeerSuggestion");
    can("update", "SubmittedPeerSuggestion");
    can("delete", "SubmittedPeerSuggestion");
  });

  return ability;
}
