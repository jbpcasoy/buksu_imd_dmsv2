import { useEffect, useState } from "react";
import { ReturnedCITLRevisionSuggestionItem, IM } from "@prisma/client";
import axios from "axios";

export interface useReturnedCITLRevisionSuggestionItemParams {
  id: string;
}
export default function useReturnedCITLRevisionSuggestionItem({ id }: useReturnedCITLRevisionSuggestionItemParams) {
  const [state, setState] = useState<ReturnedCITLRevisionSuggestionItem | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/returned_citl_revision_suggestion_item/${id}`)
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
