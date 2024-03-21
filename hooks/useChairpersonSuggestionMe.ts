import { ChairpersonSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionMeParams {
  id: string;
}
export default function useChairpersonSuggestionMe(
  { id }: useChairpersonSuggestionMeParams,
  refreshFlag?: number
) {
  const [state, setState] = useState<ChairpersonSuggestion | null>();

  useEffect(() => {
    console.log({ id });
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson_suggestion/im/${id}/me`)
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
