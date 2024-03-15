import { PeerSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemActionTakenPeerSuggestionItemParams {
  id: string;
}
export default function usePeerSuggestionItemActionTakenPeerSuggestionItem(
  { id }: usePeerSuggestionItemActionTakenPeerSuggestionItemParams,
  refreshFlag?: number
) {
  const [state, setState] = useState<PeerSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_suggestion_item_action_taken/peer_suggestion_item/${id}`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id, refreshFlag]);

  return state;
}
