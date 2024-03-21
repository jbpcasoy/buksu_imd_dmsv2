import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemParams {
  id: string;
}
export default function usePeerSuggestionItem({
  id,
}: usePeerSuggestionItemParams) {
  const [state, setState] = useState<PeerSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_suggestion_item/${id}`)
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
