import { PeerSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemActionTakenParams {
  id: string;
}
export default function usePeerSuggestionItemActionTaken({
  id,
}: usePeerSuggestionItemActionTakenParams) {
  const [state, setState] = useState<PeerSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_suggestion_item_action_taken/${id}`)
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
  }, [id]);

  return state;
}
