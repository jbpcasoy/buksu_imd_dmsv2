import { useEffect, useState } from "react";
import { IDDSpecialistSuggestionItemActionTaken, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItemParams {
  id: string;
}
export default function useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem({ id }: useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItemParams) {
  const [state, setState] = useState<IDDSpecialistSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_specialist_suggestion_item_action_taken/idd_specialist_suggestion_item/${id}`)
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
