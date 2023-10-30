import { SubmittedQAMISSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedQAMISSuggestionIMParams {
  id: string;
}
export default function useSubmittedQAMISSuggestionIM({
  id,
}: useSubmittedQAMISSuggestionIMParams) {
  const [state, setState] = useState<SubmittedQAMISSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/submitted_qamis_suggestion/im/${id}`)
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
