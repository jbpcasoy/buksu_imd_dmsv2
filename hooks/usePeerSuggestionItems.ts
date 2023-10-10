import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function usePeerSuggestionItems({ skip, take, filter }: usePeerSuggestionItemsParams) {
  const [state, setState] = useState<{peerSuggestionItems: PeerSuggestionItem[], count: number}>({
    count: 0,
    peerSuggestionItems: []
  });

  useEffect(() => {
    axios
      .get("/api/peer_suggestion_item", {
        params: {
          skip,
          take,
          filter
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
