import { CoordinatorSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useCoordinatorSuggestionItemActionTakens({
  skip,
  take,
  filter,
}: useCoordinatorSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{
    coordinatorSuggestionItemActionTakens: CoordinatorSuggestionItemActionTaken[];
    count: number;
  }>({
    count: 0,
    coordinatorSuggestionItemActionTakens: [],
  });

  useEffect(() => {
    axios
      .get("/api/coordinator_suggestion_item_action_taken", {
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
