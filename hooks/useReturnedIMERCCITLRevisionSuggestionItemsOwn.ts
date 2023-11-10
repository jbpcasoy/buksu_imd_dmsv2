import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedIMERCCITLRevisionSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string
}
export default function useReturnedIMERCCITLRevisionSuggestionItemsOwn({ skip, take, id }: useReturnedIMERCCITLRevisionSuggestionItemsOwnParams) {
  const [state, setState] = useState<{returnedIMERCCITLRevisionSuggestionItems: ReturnedIMERCCITLRevisionSuggestionItem[], count: number}>({
    count: 0,
    returnedIMERCCITLRevisionSuggestionItems: []
  });

  useEffect(() => {
    if(!id) {
        return;
    }
    axios
      .get("/api/returned_imerc_citl_revision_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            returnedIMERCCITLRevisionId: id
          }
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id]);

  return state;
}
