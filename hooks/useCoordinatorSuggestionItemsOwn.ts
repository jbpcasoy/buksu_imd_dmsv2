import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useCoordinatorSuggestionItemsOwn(
  { skip, take, id }: useCoordinatorSuggestionItemsOwnParams,
  refreshFlag: number
) {
  const [state, setState] = useState<{
    coordinatorSuggestionItems: CoordinatorSuggestionItem[];
    count: number;
  }>({
    count: 0,
    coordinatorSuggestionItems: [],
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/coordinator_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            coordinatorSuggestionId: id,
          },
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, id, refreshFlag]);

  return state;
}
