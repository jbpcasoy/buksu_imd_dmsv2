import { CoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCoordinatorSuggestions({
  skip,
  take,
  filter,
}: useCoordinatorSuggestionsParams) {
  const [state, setState] = useState<{
    coordinatorSuggestions: CoordinatorSuggestion[];
    count: number;
  }>({
    count: 0,
    coordinatorSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/coordinator_suggestion", {
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
