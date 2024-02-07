import { useEffect, useState } from "react";
import { PeerSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface usePeerSuggestionMeParams {
  id: string;
}
export default function usePeerSuggestionMe({ id }: usePeerSuggestionMeParams, refreshFlag?: number) {
  const [state, setState] = useState<PeerSuggestion | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/peer_suggestion/im/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        if (!subscribe) return;
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id, refreshFlag]);

  return state;
}
