import { ContentSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistSuggestionsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useContentSpecialistSuggestions({ skip, take, filter }: useContentSpecialistSuggestionsParams) {
  const [state, setState] = useState<{contentSpecialistSuggestions: ContentSpecialistSuggestion[], count: number}>({
    count: 0,
    contentSpecialistSuggestions: []
  });

  useEffect(() => {
    axios
      .get("/api/content_specialist_suggestion", {
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
