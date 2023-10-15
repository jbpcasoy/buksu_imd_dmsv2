import { useEffect, useState } from "react";
import { ContentSpecialistSuggestionItem, IM } from "@prisma/client";
import axios from "axios";

export interface useContentSpecialistSuggestionItemParams {
  id: string;
}
export default function useContentSpecialistSuggestionItem({ id }: useContentSpecialistSuggestionItemParams) {
  const [state, setState] = useState<ContentSpecialistSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist_suggestion_item/${id}`)
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
