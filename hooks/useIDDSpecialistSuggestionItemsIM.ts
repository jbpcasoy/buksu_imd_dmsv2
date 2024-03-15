import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useIDDSpecialistSuggestionItemsIM({
  skip,
  take,
  id,
}: useIDDSpecialistSuggestionItemsIMParams) {
  const [state, setState] = useState<{
    iDDSpecialistSuggestionItems: IDDSpecialistSuggestionItem[];
    count: number;
  }>({
    count: 0,
    iDDSpecialistSuggestionItems: [],
  });

  useEffect(() => {
    console.log({ skip, take, id });
    if (!id) {
      return;
    }
    axios
      .get(`/api/idd_specialist_suggestion_item/im/${id}`, {
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
