import { CoordinatorSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorSuggestionItemActionTakenParams {
  id: string;
}
export default function useCoordinatorSuggestionItemActionTaken({
  id,
}: useCoordinatorSuggestionItemActionTakenParams) {
  const [state, setState] =
    useState<CoordinatorSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/coordinator_suggestion_item_action_taken/${id}`)
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
