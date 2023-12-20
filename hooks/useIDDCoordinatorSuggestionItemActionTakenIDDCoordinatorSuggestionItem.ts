import { useEffect, useState } from "react";
import { IDDCoordinatorSuggestionItemActionTaken, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItemParams {
  id: string;
}
export default function useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem({ id }: useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItemParams, refreshFlag?: number) {
  const [state, setState] = useState<IDDCoordinatorSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator_suggestion_item_action_taken/idd_coordinator_suggestion_item/${id}`)
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
  }, [id, refreshFlag]);

  return state;
}
