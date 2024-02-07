import { useEffect, useState } from "react";
import { IDDCoordinatorSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDCoordinatorSuggestionParams {
  id?: string;
}
export default function useIDDCoordinatorSuggestion({ id }: useIDDCoordinatorSuggestionParams) {
  const [state, setState] = useState<IDDCoordinatorSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator_suggestion/${id}`)
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
