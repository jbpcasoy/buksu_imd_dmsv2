import { useEffect, useState } from "react";
import { ContentSpecialistSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useContentSpecialistSuggestionMeParams {
  id: string;
}
export default function useContentSpecialistSuggestionMe({ id }: useContentSpecialistSuggestionMeParams) {
  const [state, setState] = useState<ContentSpecialistSuggestion | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist_suggestion/im/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        if (!subscribe) return;
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
