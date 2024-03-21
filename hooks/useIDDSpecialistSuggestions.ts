import { IDDSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIDDSpecialistSuggestions({
  skip,
  take,
  filter,
}: useIDDSpecialistSuggestionsParams) {
  const [state, setState] = useState<{
    iDDSpecialistSuggestions: IDDSpecialistSuggestion[];
    count: number;
  }>({
    count: 0,
    iDDSpecialistSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/idd_specialist_suggestion", {
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
