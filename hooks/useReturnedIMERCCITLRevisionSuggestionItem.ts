import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedIMERCCITLRevisionSuggestionItemParams {
  id: string;
}
export default function useReturnedIMERCCITLRevisionSuggestionItem({
  id,
}: useReturnedIMERCCITLRevisionSuggestionItemParams) {
  const [state, setState] =
    useState<ReturnedIMERCCITLRevisionSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_imerc_citl_revision_suggestion_item/${id}`)
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
