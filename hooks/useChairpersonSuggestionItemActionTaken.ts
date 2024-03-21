import { ChairpersonSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionItemActionTakenParams {
  id: string;
}
export default function useChairpersonSuggestionItemActionTaken({
  id,
}: useChairpersonSuggestionItemActionTakenParams) {
  const [state, setState] =
    useState<ChairpersonSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson_suggestion_item_action_taken/${id}`)
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
