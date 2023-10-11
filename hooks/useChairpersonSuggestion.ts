import { useEffect, useState } from "react";
import { ChairpersonSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useChairpersonSuggestionParams {
  id: string;
}
export default function useChairpersonSuggestion({ id }: useChairpersonSuggestionParams) {
  const [state, setState] = useState<ChairpersonSuggestion | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson_suggestion/${id}`)
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
