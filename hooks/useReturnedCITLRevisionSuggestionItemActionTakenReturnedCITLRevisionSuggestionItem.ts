import { ReturnedCITLRevisionSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItemParams {
  id: string;
}
export default function useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem(
  {
    id,
  }: useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItemParams,
  refreshFlag?: number
) {
  const [state, setState] =
    useState<ReturnedCITLRevisionSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(
        `/api/returned_citl_revision_suggestion_item_action_taken/returned_citl_revision_suggestion_item/${id}`
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
