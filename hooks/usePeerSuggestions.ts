import { PeerSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function usePeerSuggestions({
  skip,
  take,
  filter,
}: usePeerSuggestionsParams) {
  const [state, setState] = useState<{
    peerSuggestions: PeerSuggestion[];
    count: number;
  }>({
    count: 0,
    peerSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/peer_suggestion", {
        params: {
          skip,
          take,
          filter,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
