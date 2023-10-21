import { useEffect, useState } from "react";
import { SubmittedIDDSpecialistSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedIDDSpecialistSuggestionIMParams {
  id?: string;
}
export default function useSubmittedIDDSpecialistSuggestionIM({
  id,
}: useSubmittedIDDSpecialistSuggestionIMParams) {
  const [state, setState] =
    useState<SubmittedIDDSpecialistSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_idd_specialist_suggestion/im/${id}`)
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
