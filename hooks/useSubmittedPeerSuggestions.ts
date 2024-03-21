import { SubmittedPeerSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedPeerSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedPeerSuggestions({
  skip,
  take,
  filter,
}: useSubmittedPeerSuggestionsParams) {
  const [state, setState] = useState<{
    submittedPeerSuggestions: SubmittedPeerSuggestion[];
    count: number;
  }>({
    count: 0,
    submittedPeerSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_peer_suggestion", {
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
