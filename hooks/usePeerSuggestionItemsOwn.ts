import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string
}
export default function usePeerSuggestionItemsOwn({ skip, take, id }: usePeerSuggestionItemsOwnParams) {
  const [state, setState] = useState<{peerSuggestionItems: PeerSuggestionItem[], count: number}>({
    count: 0,
    peerSuggestionItems: []
  });

  useEffect(() => {
    if(!id) {
        return;
    }
    axios
      .get("/api/peer_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            peerSuggestionId: id
          }
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id]);

  return state;
}
