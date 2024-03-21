import { IDDCoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionMeParams {
  id: string;
}
export default function useIDDCoordinatorSuggestionMe(
  { id }: useIDDCoordinatorSuggestionMeParams,
  refreshFlag?: number
) {
  const [state, setState] = useState<IDDCoordinatorSuggestion | null>();

  useEffect(() => {
    console.log({ id });
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/idd_coordinator_suggestion/im/${id}/me`)
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
