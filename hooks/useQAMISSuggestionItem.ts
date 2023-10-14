import { useEffect, useState } from "react";
import { QAMISSuggestionItem, IM } from "@prisma/client";
import axios from "axios";

export interface useQAMISSuggestionItemParams {
  id: string;
}
export default function useQAMISSuggestionItem({ id }: useQAMISSuggestionItemParams) {
  const [state, setState] = useState<QAMISSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_suggestion_item/${id}`)
      .then((res) => {
        if(!subscribe) return;
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
