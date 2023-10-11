import { SubmittedChairpersonSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedChairpersonSuggestionParams {
  id: string;
}
export default function useSubmittedChairpersonSuggestion({
  id,
}: useSubmittedChairpersonSuggestionParams) {
  const [state, setState] = useState<SubmittedChairpersonSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_chairperson_suggestion/${id}`)
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
