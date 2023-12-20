import { useEffect, useState } from "react";
import { IDDSpecialistSuggestion, IM } from "@prisma/client";
import axios from "axios";

export interface useIDDSpecialistSuggestionMeParams {
  id: string;
}
export default function useIDDSpecialistSuggestionMe({ id }: useIDDSpecialistSuggestionMeParams, refreshFlag?: number) {
  const [state, setState] = useState<IDDSpecialistSuggestion | null>();

  useEffect(() => {
    console.log({id})
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_specialist_suggestion/im/${id}/me`)
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
