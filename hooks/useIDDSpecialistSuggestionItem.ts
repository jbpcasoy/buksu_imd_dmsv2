import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistSuggestionItemParams {
  id: string;
}
export default function useIDDSpecialistSuggestionItem({
  id,
}: useIDDSpecialistSuggestionItemParams) {
  const [state, setState] = useState<IDDSpecialistSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_specialist_suggestion_item/${id}`)
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
