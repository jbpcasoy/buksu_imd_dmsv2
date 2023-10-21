import { useEffect, useState } from "react";
import { SubmittedIDDCoordinatorSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedIDDCoordinatorSuggestionIMParams {
  id?: string;
}
export default function useSubmittedIDDCoordinatorSuggestionIM({
  id,
}: useSubmittedIDDCoordinatorSuggestionIMParams) {
  const [state, setState] =
    useState<SubmittedIDDCoordinatorSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_idd_coordinator_suggestion/im/${id}`)
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
