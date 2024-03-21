import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useCoordinatorSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useCoordinatorSuggestionItemsIM({
  skip,
  take,
  id,
}: useCoordinatorSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    coordinatorSuggestionItems: CoordinatorSuggestionItem[];
    count: number;
  }>({
    count: 0,
    coordinatorSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/coordinator_suggestion_item/im/${id}`, {
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
