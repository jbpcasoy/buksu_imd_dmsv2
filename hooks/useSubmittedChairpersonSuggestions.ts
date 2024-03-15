import { SubmittedChairpersonSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedChairpersonSuggestionsParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useSubmittedChairpersonSuggestions({
  skip,
  take,
  filter,
}: useSubmittedChairpersonSuggestionsParams) {
  const [state, setState] = useState<{
    submittedChairpersonSuggestions: SubmittedChairpersonSuggestion[];
    count: number;
  }>({
    count: 0,
    submittedChairpersonSuggestions: [],
  });

  useEffect(() => {
    axios
      .get("/api/submitted_chairperson_suggestion", {
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
