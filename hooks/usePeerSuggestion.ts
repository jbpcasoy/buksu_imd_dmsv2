import { useEffect, useState } from "react";
import { PeerSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface usePeerSuggestionParams {
  id?: string;
}
export default function usePeerSuggestion({ id }: usePeerSuggestionParams) {
  const [state, setState] = useState<PeerSuggestion | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_suggestion/${id}`)
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
