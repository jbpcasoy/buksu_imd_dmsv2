import { ContentSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistSuggestionItemsOwnParams {
  skip: number;
  take: number;
  id?: string;
}
export default function useContentSpecialistSuggestionItemsOwn({
  skip,
  take,
  id,
}: useContentSpecialistSuggestionItemsOwnParams) {
  const [state, setState] = useState<{
    contentSpecialistSuggestionItems: ContentSpecialistSuggestionItem[];
    count: number;
  }>({
    count: 0,
    contentSpecialistSuggestionItems: [],
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/content_specialist_suggestion_item", {
        params: {
          skip,
          take,
          filter: {
            contentSpecialistSuggestionId: id,
          },
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
