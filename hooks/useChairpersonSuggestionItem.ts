import { useEffect, useState } from "react";
import { ChairpersonSuggestionItem, IM } from "@prisma/client";
import axios from "axios";

export interface useChairpersonSuggestionItemParams {
  id: string;
}
export default function useChairpersonSuggestionItem({ id }: useChairpersonSuggestionItemParams) {
  const [state, setState] = useState<ChairpersonSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/chairperson_suggestion_item/${id}`)
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
