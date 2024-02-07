import { useEffect, useState } from "react";
import { ContentSpecialistSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useContentSpecialistSuggestionParams {
  id?: string;
}
export default function useContentSpecialistSuggestion({ id }: useContentSpecialistSuggestionParams) {
  const [state, setState] = useState<ContentSpecialistSuggestion | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/content_specialist_suggestion/${id}`)
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
