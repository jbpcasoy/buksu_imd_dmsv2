import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionItemParams {
  id: string;
}
export default function useIDDCoordinatorSuggestionItem({
  id,
}: useIDDCoordinatorSuggestionItemParams) {
  const [state, setState] = useState<IDDCoordinatorSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator_suggestion_item/${id}`)
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
