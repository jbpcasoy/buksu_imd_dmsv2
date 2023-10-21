import { useEffect, useState } from "react";
import { SubmittedContentSpecialistSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedContentSpecialistSuggestionIMParams {
  id?: string;
}
export default function useSubmittedContentSpecialistSuggestionIM({
  id,
}: useSubmittedContentSpecialistSuggestionIMParams) {
  const [state, setState] =
    useState<SubmittedContentSpecialistSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_content_specialist_suggestion/im/${id}`)
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
