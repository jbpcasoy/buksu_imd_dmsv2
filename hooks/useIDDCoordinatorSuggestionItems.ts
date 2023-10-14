import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useIDDCoordinatorSuggestionItems({ skip, take, filter }: useIDDCoordinatorSuggestionItemsParams) {
  const [state, setState] = useState<{iDDCoordinatorSuggestionItems: IDDCoordinatorSuggestionItem[], count: number}>({
    count: 0,
    iDDCoordinatorSuggestionItems: []
  });

  useEffect(() => {
    axios
      .get("/api/idd_coordinator_suggestion_item", {
        params: {
          skip,
          take,
          filter
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter]);

  return state;
}
