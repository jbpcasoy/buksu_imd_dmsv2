import { useEffect, useState } from "react";
import { SubmittedCoordinatorSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedCoordinatorSuggestionIMParams {
  id?: string;
}
export default function useSubmittedCoordinatorSuggestionIM({ id }: useSubmittedCoordinatorSuggestionIMParams) {
  const [state, setState] = useState<SubmittedCoordinatorSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_coordinator_suggestion/im/${id}`)
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
