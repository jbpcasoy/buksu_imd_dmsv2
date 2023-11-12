import { ChairpersonSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useChairpersonSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object
}
export default function useChairpersonSuggestionItemActionTakens({ skip, take, filter }: useChairpersonSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{chairpersonSuggestionItemActionTakens: ChairpersonSuggestionItemActionTaken[], count: number}>({
    count: 0,
    chairpersonSuggestionItemActionTakens: []
  });

  useEffect(() => {
    axios
      .get("/api/chairperson_suggestion_item_action_taken", {
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
