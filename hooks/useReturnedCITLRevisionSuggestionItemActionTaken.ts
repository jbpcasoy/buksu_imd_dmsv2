import { useEffect, useState } from "react";
import { ReturnedCITLRevisionSuggestionItemActionTaken, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedCITLRevisionSuggestionItemActionTakenParams {
  id: string;
}
export default function useReturnedCITLRevisionSuggestionItemActionTaken({ id }: useReturnedCITLRevisionSuggestionItemActionTakenParams) {
  const [state, setState] = useState<ReturnedCITLRevisionSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_citl_revision_suggestion_item_action_taken/${id}`)
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
