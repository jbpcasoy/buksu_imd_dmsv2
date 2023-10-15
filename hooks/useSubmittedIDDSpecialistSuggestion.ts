import { SubmittedIDDSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedIDDSpecialistSuggestionParams {
  id: string;
}
export default function useSubmittedIDDSpecialistSuggestion({
  id,
}: useSubmittedIDDSpecialistSuggestionParams) {
  const [state, setState] = useState<SubmittedIDDSpecialistSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_idd_specialist_suggestion/${id}`)
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
