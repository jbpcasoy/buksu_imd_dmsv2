import { QAMISSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISSuggestionParams {
  id?: string;
}
export default function useQAMISSuggestion({ id }: useQAMISSuggestionParams) {
  const [state, setState] = useState<QAMISSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_suggestion/${id}`)
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
