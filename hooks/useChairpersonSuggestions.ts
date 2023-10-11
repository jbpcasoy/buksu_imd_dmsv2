import { ChairpersonSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useChairpersonSuggestions({ skip, take, filter }: useChairpersonSuggestionsParams) {
  const [state, setState] = useState<{chairpersonSuggestions: ChairpersonSuggestion[], count: number}>({
    count: 0,
    chairpersonSuggestions: []
  });

  useEffect(() => {
    axios
      .get("/api/chairperson_suggestion", {
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
