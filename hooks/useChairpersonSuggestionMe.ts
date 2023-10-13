import { useEffect, useState } from "react";
import { ChairpersonSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useChairpersonSuggestionMeParams {
  id: string;
}
export default function useChairpersonSuggestionMe({ id }: useChairpersonSuggestionMeParams) {
  const [state, setState] = useState<ChairpersonSuggestion | null>();

  useEffect(() => {
    console.log({id})
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
  }, [id]);

  return state;
}
