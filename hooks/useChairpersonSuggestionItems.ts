import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useChairpersonSuggestionItems({
  skip,
  take,
  filter,
}: useChairpersonSuggestionItemsParams) {
  const [state, setState] = useState<{
    chairpersonSuggestionItems: ChairpersonSuggestionItem[];
    count: number;
  }>({
    count: 0,
    chairpersonSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/chairperson_suggestion_item", {
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
