import { QAMISSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISSuggestionMeParams {
  id: string;
}
export default function useQAMISSuggestionMe(
  { id }: useQAMISSuggestionMeParams,
  refreshFlag?: number
) {
  const [state, setState] = useState<QAMISSuggestion | null>();

  useEffect(() => {
    console.log({ id });
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_suggestion/im/${id}/me`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        if (!subscribe) return;
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id, refreshFlag]);

  return state;
}
