import { SubmittedPeerSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedPeerSuggestionParams {
  id: string;
}
export default function useSubmittedPeerSuggestion({
  id,
}: useSubmittedPeerSuggestionParams) {
  const [state, setState] = useState<SubmittedPeerSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_peer_suggestion/${id}`)
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
