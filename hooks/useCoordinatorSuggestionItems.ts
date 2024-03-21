import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCoordinatorSuggestionItems({
  skip,
  take,
  filter,
}: useCoordinatorSuggestionItemsParams) {
  const [state, setState] = useState<{
    coordinatorSuggestionItems: CoordinatorSuggestionItem[];
    count: number;
  }>({
    count: 0,
    coordinatorSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/coordinator_suggestion_item", {
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
