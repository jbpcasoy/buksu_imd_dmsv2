import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string
}
export default function useChairpersonSuggestionItemsOwn({ skip, take, id }: useChairpersonSuggestionItemsOwnParams) {
  const [state, setState] = useState<{chairpersonSuggestionItems: ChairpersonSuggestionItem[], count: number}>({
    count: 0,
    chairpersonSuggestionItems: []
  });

  useEffect(() => {
    if(!id) {
        return;
    }
    axios
      .get("/api/chairperson_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            chairpersonSuggestionId: id
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
