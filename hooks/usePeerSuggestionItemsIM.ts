import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string
}
export default function usePeerSuggestionItemsIM({ skip, take, id }: usePeerSuggestionItemsIMParams) {
  const [state, setState] = useState<{peerSuggestionItems: PeerSuggestionItem[], count: number}>({
    count: 0,
    peerSuggestionItems: []
  });

  useEffect(() => {
    console.log({skip, take, id})
    if(!id) {
        return;
    }
    axios
      .get(`/api/peer_suggestion_item/im/${id}`, {
        params: {
          skip,
          take,
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
