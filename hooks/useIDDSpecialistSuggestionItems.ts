import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIDDSpecialistSuggestionItems({
  skip,
  take,
  filter,
}: useIDDSpecialistSuggestionItemsParams) {
  const [state, setState] = useState<{
    iDDSpecialistSuggestionItems: IDDSpecialistSuggestionItem[];
    count: number;
  }>({
    count: 0,
    iDDSpecialistSuggestionItems: [],
  });

  useEffect(() => {
    axios
      .get("/api/idd_specialist_suggestion_item", {
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
