import { ContentSpecialistSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useContentSpecialistSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useContentSpecialistSuggestionItemActionTakens({
  skip,
  take,
  filter,
}: useContentSpecialistSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{
    contentSpecialistSuggestionItemActionTakens: ContentSpecialistSuggestionItemActionTaken[];
    count: number;
  }>({
    count: 0,
    contentSpecialistSuggestionItemActionTakens: [],
  });

  useEffect(() => {
    axios
      .get("/api/content_specialist_suggestion_item_action_taken", {
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
