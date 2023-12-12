import { useEffect, useState } from "react";
import { CoordinatorSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useCoordinatorSuggestionParams {
  id?: string;
}
export default function useCoordinatorSuggestion({ id }: useCoordinatorSuggestionParams) {
  const [state, setState] = useState<CoordinatorSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator_suggestion/${id}`)
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
