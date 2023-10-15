import { SubmittedIDDSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedIDDSpecialistSuggestionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useSubmittedIDDSpecialistSuggestions({ skip, take, filter }: useSubmittedIDDSpecialistSuggestionsParams) {
  const [state, setState] = useState<{submittedIDDSpecialistSuggestions: SubmittedIDDSpecialistSuggestion[], count: number}>({
    count: 0,
    submittedIDDSpecialistSuggestions: []
  });

  useEffect(() => {
    axios
      .get("/api/submitted_idd_specialist_suggestion", {
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
