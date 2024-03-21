import { ChairpersonSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionItemActionTakenChairpersonSuggestionItemParams {
  id: string;
}
export default function useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem(
  {
    id,
  }: useChairpersonSuggestionItemActionTakenChairpersonSuggestionItemParams,
  refreshFlag?: number
) {
  const [state, setState] =
    useState<ChairpersonSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(
        `/api/chairperson_suggestion_item_action_taken/chairperson_suggestion_item/${id}`
      )
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
  }, [id, refreshFlag]);

  return state;
}
