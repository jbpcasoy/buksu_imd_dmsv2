import { ContentSpecialistSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItemParams {
  id: string;
}
export default function useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem(
  {
    id,
  }: useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItemParams,
  refreshFlag?: number
) {
  const [state, setState] =
    useState<ContentSpecialistSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(
        `/api/content_specialist_suggestion_item_action_taken/content_specialist_suggestion_item/${id}`
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
