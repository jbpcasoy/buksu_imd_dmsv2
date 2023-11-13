import { useEffect, useState } from "react";
import { ReturnedIMERCCITLRevisionSuggestionItemActionTaken, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedIMERCCITLRevisionSuggestionItemActionTakenParams {
  id: string;
}
export default function useReturnedIMERCCITLRevisionSuggestionItemActionTaken({ id }: useReturnedIMERCCITLRevisionSuggestionItemActionTakenParams) {
  const [state, setState] = useState<ReturnedIMERCCITLRevisionSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_imerc_citl_revision_suggestion_item_action_taken/${id}`)
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
