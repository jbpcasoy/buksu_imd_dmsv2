import { IDDSpecialistSuggestionItemActionTaken } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useIDDSpecialistSuggestionItemActionTakensParams {
  skip: number;
  take: number;
  filter?: object;
}
export default function useIDDSpecialistSuggestionItemActionTakens({
  skip,
  take,
  filter,
}: useIDDSpecialistSuggestionItemActionTakensParams) {
  const [state, setState] = useState<{
    iDDSpecialistSuggestionItemActionTakens: IDDSpecialistSuggestionItemActionTaken[];
    count: number;
  }>({
    count: 0,
    iDDSpecialistSuggestionItemActionTakens: [],
  });

  useEffect(() => {
    axios
      .get("/api/idd_specialist_suggestion_item_action_taken", {
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
