import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDCoordinatorSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string
}
export default function useIDDCoordinatorSuggestionItemsIM({ skip, take, id }: useIDDCoordinatorSuggestionItemsIMParams) {
  const [state, setState] = useState<{iDDCoordinatorSuggestionItems: IDDCoordinatorSuggestionItem[], count: number}>({
    count: 0,
    iDDCoordinatorSuggestionItems: []
  });

  useEffect(() => {
    console.log({skip, take, id})
    if(!id) {
        return;
    }
    axios
      .get(`/api/idd_coordinator_suggestion_item/im/${id}`, {
        params: {
          skip,
          take,
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
