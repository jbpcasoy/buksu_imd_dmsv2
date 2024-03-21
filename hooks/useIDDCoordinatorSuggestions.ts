import { IDDCoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIDDCoordinatorSuggestions({
  skip,
  take,
  filter,
}: useIDDCoordinatorSuggestionsParams) {
  const [state, setState] = useState<{
    iDDCoordinatorSuggestions: IDDCoordinatorSuggestion[];
    count: number;
  }>({
    count: 0,
    iDDCoordinatorSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/idd_coordinator_suggestion", {
        params: {
          skip,
          take,
          filter,
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
