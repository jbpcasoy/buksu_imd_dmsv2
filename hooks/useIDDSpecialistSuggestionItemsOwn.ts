import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useIDDSpecialistSuggestionItemsOwn({
  skip,
  take,
  id,
}: useIDDSpecialistSuggestionItemsOwnParams, refreshFlag?: number) {
  const [state, setState] = useState<{
    iDDSpecialistSuggestionItems: IDDSpecialistSuggestionItem[];
    count: number;
  }>({
    count: 0,
    iDDSpecialistSuggestionItems: [],
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/idd_specialist_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            iDDSpecialistSuggestionId: id,
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
