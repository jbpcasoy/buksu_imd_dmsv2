import { ContentSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistSuggestionItemsParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useContentSpecialistSuggestionItems({ skip, take, filter }: useContentSpecialistSuggestionItemsParams) {
  const [state, setState] = useState<{contentSpecialistSuggestionItems: ContentSpecialistSuggestionItem[], count: number}>({
    count: 0,
    contentSpecialistSuggestionItems: []
  });

  useEffect(() => {
    axios
      .get("/api/content_specialist_suggestion_item", {
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
