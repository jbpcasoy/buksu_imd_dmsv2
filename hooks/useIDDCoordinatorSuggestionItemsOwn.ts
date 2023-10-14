import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string
}
export default function useIDDCoordinatorSuggestionItemsOwn({ skip, take, id }: useIDDCoordinatorSuggestionItemsOwnParams) {
  const [state, setState] = useState<{iDDCoordinatorSuggestionItems: IDDCoordinatorSuggestionItem[], count: number}>({
    count: 0,
    iDDCoordinatorSuggestionItems: []
  });

  useEffect(() => {
    if(!id) {
        return;
    }
    axios
      .get("/api/idd_coordinator_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            iDDCoordinatorSuggestionId: id
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
