import { useEffect, useState } from "react";
import { IDDSpecialistSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDSpecialistSuggestionParams {
  id?: string;
}
export default function useIDDSpecialistSuggestion({ id }: useIDDSpecialistSuggestionParams) {
  const [state, setState] = useState<IDDSpecialistSuggestion | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_specialist_suggestion/${id}`)
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
