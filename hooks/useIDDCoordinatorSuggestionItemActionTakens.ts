import { IDDCoordinatorSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useIDDCoordinatorSuggestionItemActionTakens({ skip, take, filter }: useIDDCoordinatorSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{iDDCoordinatorSuggestionItemActionTakens: IDDCoordinatorSuggestionItemActionTaken[], count: number}>({
    count: 0,
    iDDCoordinatorSuggestionItemActionTakens: []
  });

  useEffect(() => {
    axios
      .get("/api/idd_coordinator_suggestion_item_action_taken", {
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
