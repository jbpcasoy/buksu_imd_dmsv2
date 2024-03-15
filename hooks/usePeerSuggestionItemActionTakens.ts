import { PeerSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface usePeerSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function usePeerSuggestionItemActionTakens({
  skip,
  take,
  filter,
}: usePeerSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{
    peerSuggestionItemActionTakens: PeerSuggestionItemActionTaken[];
    count: number;
  }>({
    count: 0,
    peerSuggestionItemActionTakens: [],
  });

  useEffect(() => {
    axios
      .get("/api/peer_suggestion_item_action_taken", {
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
