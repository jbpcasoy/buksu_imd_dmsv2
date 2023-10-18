import { ContentSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistSuggestionItemsIMParams {
  skip: number;
  take: number;
  id?: string
}
export default function useContentSpecialistSuggestionItemsIM({ skip, take, id }: useContentSpecialistSuggestionItemsIMParams) {
  const [state, setState] = useState<{contentSpecialistSuggestionItems: ContentSpecialistSuggestionItem[], count: number}>({
    count: 0,
    contentSpecialistSuggestionItems: []
  });

  useEffect(() => {
    console.log({skip, take, id})
    if(!id) {
        return;
    }
    axios
      .get(`/api/content_specialist_suggestion_item/im/${id}`, {
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
