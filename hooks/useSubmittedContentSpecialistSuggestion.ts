import { SubmittedContentSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedContentSpecialistSuggestionParams {
  id: string;
}
export default function useSubmittedContentSpecialistSuggestion({
  id,
}: useSubmittedContentSpecialistSuggestionParams) {
  const [state, setState] = useState<SubmittedContentSpecialistSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_content_specialist_suggestion/${id}`)
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
