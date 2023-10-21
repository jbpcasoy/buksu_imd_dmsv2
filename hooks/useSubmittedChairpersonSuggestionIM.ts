import { useEffect, useState } from "react";
import { SubmittedChairpersonSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useSubmittedChairpersonSuggestionIMParams {
  id?: string;
}
export default function useSubmittedChairpersonSuggestionIM({ id }: useSubmittedChairpersonSuggestionIMParams) {
  const [state, setState] = useState<SubmittedChairpersonSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_chairperson_suggestion/im/${id}`)
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
