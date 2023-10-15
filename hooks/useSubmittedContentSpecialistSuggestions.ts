import { SubmittedContentSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSubmittedContentSpecialistSuggestionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useSubmittedContentSpecialistSuggestions({ skip, take, filter }: useSubmittedContentSpecialistSuggestionsParams) {
  const [state, setState] = useState<{submittedContentSpecialistSuggestions: SubmittedContentSpecialistSuggestion[], count: number}>({
    count: 0,
    submittedContentSpecialistSuggestions: []
  });

  useEffect(() => {
    axios
      .get("/api/submitted_content_specialist_suggestion", {
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
