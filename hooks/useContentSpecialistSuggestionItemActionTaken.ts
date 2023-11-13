import { useEffect, useState } from "react";
import { ContentSpecialistSuggestionItemActionTaken, IM } from "@prisma/client";
import axios from "axios";

export interface useContentSpecialistSuggestionItemActionTakenParams {
  id: string;
}
export default function useContentSpecialistSuggestionItemActionTaken({ id }: useContentSpecialistSuggestionItemActionTakenParams) {
  const [state, setState] = useState<ContentSpecialistSuggestionItemActionTaken | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist_suggestion_item_action_taken/${id}`)
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