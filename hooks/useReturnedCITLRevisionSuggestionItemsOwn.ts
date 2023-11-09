import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useReturnedCITLRevisionSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string
}
export default function useReturnedCITLRevisionSuggestionItemsOwn({ skip, take, id }: useReturnedCITLRevisionSuggestionItemsOwnParams) {
  const [state, setState] = useState<{returnedCITLRevisionSuggestionItems: ReturnedCITLRevisionSuggestionItem[], count: number}>({
    count: 0,
    returnedCITLRevisionSuggestionItems: []
  });

  useEffect(() => {
    if(!id) {
        return;
    }
    axios
      .get("/api/returned_citl_revision_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            returnedCITLRevisionId: id
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
