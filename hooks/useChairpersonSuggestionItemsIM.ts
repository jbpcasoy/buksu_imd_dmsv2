import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useChairpersonSuggestionItemsIM({
  skip,
  take,
  id,
}: useChairpersonSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    chairpersonSuggestionItems: ChairpersonSuggestionItem[];
    count: number;
  }>({
    count: 0,
    chairpersonSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/chairperson_suggestion_item/im/${id}`, {
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
