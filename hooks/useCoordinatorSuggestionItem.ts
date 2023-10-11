import { useEffect, useState } from "react";
import { CoordinatorSuggestionItem, IM } from "@prisma/client";
import axios from "axios";

export interface useCoordinatorSuggestionItemParams {
  id: string;
}
export default function useCoordinatorSuggestionItem({ id }: useCoordinatorSuggestionItemParams) {
  const [state, setState] = useState<CoordinatorSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator_suggestion_item/${id}`)
      .then((res) => {
        if(!subscribe) return;
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
